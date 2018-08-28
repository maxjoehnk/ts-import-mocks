import {
    MockAst,
    MockAsts,
    MockDataGenerator,
    MockProperty
} from './contracts';
import {
    createProgram,
    getCombinedModifierFlags,
    getLeadingCommentRanges,
    InterfaceDeclaration,
    isInterfaceDeclaration,
    isPropertySignature,
    isTypeLiteralNode,
    isTypeReferenceNode,
    ModifierFlags,
    Node,
    PropertySignature,
    SourceFile,
    SyntaxKind,
    TypeChecker
} from 'typescript';

const commentAnnotationRegex = /#\[([a-z.]+)\]/;

interface TypescriptCompiler {
    typeChecker: TypeChecker;
    file: SourceFile;
    text: string;
}

function typescriptSetup(path: string): TypescriptCompiler {
    const program = createProgram([path], {});

    const typeChecker = program.getTypeChecker();

    const file = program.getSourceFile(path);
    const text = file.getText();

    return {
        typeChecker,
        file,
        text
    };
}

export function generateSingleAst(path: string): MockAst {
    const compiler = typescriptSetup(path);

    const interfaceDeclaration = findInterface(compiler.file);

    return generateAstFromDeclaration(compiler, interfaceDeclaration);
}

export function generateMultipleAsts(path: string): MockAsts {
    const compiler = typescriptSetup(path);

    const interfaceDeclarations = findInterfaces(compiler.file);

    const asts = {};

    for (const interfaceDeclaration of interfaceDeclarations) {
        const name = interfaceDeclaration.name.getText();
        asts[name] = generateAstFromDeclaration(compiler, interfaceDeclaration);
    }

    return asts;
}

function generateAstFromDeclaration(
    compiler: TypescriptCompiler,
    declaration: InterfaceDeclaration
): MockAst {
    const name = declaration.name.getText();
    const properties = declaration.members
        .filter(isPropertySignature)
        .map(getPropertyFromMember(compiler));

    return {
        name,
        properties
    };
}

function getPropertyFromMember(
    compiler: TypescriptCompiler
): (node: PropertySignature) => MockProperty {
    function getProperty(node: PropertySignature): MockProperty {
        const { typeChecker, text } = compiler;
        const comments = getLeadingCommentRanges(text, node.pos);

        const type = typeChecker.typeToString(
            typeChecker.getTypeFromTypeNode(node.type)
        );

        const property: MockProperty = {
            name: node.name.getText(),
            type
        };

        if (comments) {
            const generators = comments
                .map(comment => text.slice(comment.pos, comment.end))
                .filter(comment => commentAnnotationRegex.test(comment))
                .map(comment => commentAnnotationRegex.exec(comment)[1])
                .filter(isGeneratorAnnotation);

            if (generators.length === 1) {
                property.generator = generators[0];
            } else if (generators.length > 1) {
                throw new Error(
                    `Multiple generators found ${JSON.stringify(generators)}`
                );
            }
        }

        return property;
    }

    return (node: PropertySignature) => {
        if (isTypeLiteralNode(node.type)) {
            const property: MockProperty = {
                name: node.name.getText(),
                type: 'object'
            };

            const properties = node.type.members.map(
                getPropertyFromMember(compiler)
            );

            property.ast = {
                properties
            };

            return property;
        }
        if (isTypeReferenceNode(node.type)) {
            const type = compiler.typeChecker.getTypeFromTypeNode(node.type);
            const symbol = type.getSymbol();

            // FIXME: eh
            if ((<any>symbol).declaredType == null) {
                const declarations = symbol.getDeclarations();
                const [declaration] = declarations; // FIXME: eh

                if (isInterfaceDeclaration(declaration)) {
                    const property: MockProperty = {
                        name: node.name.getText(),
                        type: 'object',
                        ast: generateAstFromDeclaration(compiler, declaration)
                    };

                    return property;
                }
            }
        }
        return getProperty(node);
    };
}

function findInterface(node: Node): InterfaceDeclaration {
    if (isInterfaceDeclaration(node) && isInterfaceExported(node)) {
        return <InterfaceDeclaration>node;
    }

    for (const child of node.getChildren()) {
        const childInterface = findInterface(child);

        if (childInterface != null) {
            return childInterface;
        }
    }
}

function findInterfaces(node: Node): InterfaceDeclaration[] {
    let interfaces = [];

    if (isInterfaceDeclaration(node) && isInterfaceExported(node)) {
        interfaces.push(<InterfaceDeclaration>node);
    }

    for (const child of node.getChildren()) {
        interfaces = [...interfaces, ...findInterfaces(child)];
    }

    return interfaces;
}

function isInterfaceExported(
    interfaceDeclaration: InterfaceDeclaration
): boolean {
    return (
        (getCombinedModifierFlags(interfaceDeclaration) &
            ModifierFlags.Export) !==
            0 ||
        (!!interfaceDeclaration.parent &&
            interfaceDeclaration.parent.kind === SyntaxKind.SourceFile)
    );
}

function isGeneratorAnnotation(
    annotation: string
): annotation is MockDataGenerator {
    return Object.getOwnPropertyNames(MockDataGenerator)
        .map(name => MockDataGenerator[name])
        .some(generator => generator === annotation);
}
