import {
    MockArrayProperty,
    MockAst,
    MockAsts,
    MockDataGenerator,
    MockLiteralProperty,
    MockObjectProperty,
    MockProperty
} from './contracts';
import {
    ArrayTypeNode,
    CommentRange,
    createProgram,
    getCombinedModifierFlags,
    getLeadingCommentRanges,
    InterfaceDeclaration,
    isArrayTypeNode,
    isInterfaceDeclaration,
    isPropertySignature,
    isTypeLiteralNode,
    isTypeReferenceNode,
    ModifierFlags,
    Node,
    PropertySignature,
    SourceFile,
    SyntaxKind,
    TypeChecker,
    TypeLiteralNode,
    TypeNode,
    TypeReferenceNode
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

function getGeneratorFromComment(
    text: string,
    comments: CommentRange[]
): MockDataGenerator {
    const generators = comments
        .map(comment => text.slice(comment.pos, comment.end))
        .filter(comment => commentAnnotationRegex.test(comment))
        .map(comment => commentAnnotationRegex.exec(comment)[1])
        .filter(isGeneratorAnnotation);

    if (generators.length === 1) {
        return generators[0];
    } else if (generators.length > 1) {
        throw new Error(
            `Multiple generators found ${JSON.stringify(generators)}`
        );
    }
}

function getPropertyFromMember(
    compiler: TypescriptCompiler
): (node: PropertySignature) => MockProperty {
    function getLiteralProperty(
        name: string,
        node: TypeNode
    ): MockLiteralProperty {
        const { typeChecker, text } = compiler;
        const comments = getLeadingCommentRanges(text, node.pos);

        const type = typeChecker.typeToString(
            typeChecker.getTypeFromTypeNode(node)
        );

        const property: MockLiteralProperty = {
            type: 'literal',
            name,
            literalType: type
        };

        if (comments) {
            property.generator = getGeneratorFromComment(text, comments);
        }

        return property;
    }

    function getInlineObjectNode(
        name: string,
        node: TypeLiteralNode
    ): MockObjectProperty {
        const properties = node.members.map(getPropertyFromMember(compiler));

        const property: MockObjectProperty = {
            type: 'object',
            name,
            ast: {
                properties
            }
        };

        return property;
    }

    function getTypeReferenceNode(
        name: string,
        node: TypeReferenceNode
    ): MockObjectProperty {
        const type = compiler.typeChecker.getTypeFromTypeNode(node);
        const symbol = type.getSymbol();

        if ((<any>symbol).declaredType != null) {
            throw new Error('FIXME'); // FIXME
        }

        const declarations = symbol.getDeclarations();
        const [declaration] = declarations; // FIXME: eh

        if (isInterfaceDeclaration(declaration)) {
            const property: MockObjectProperty = {
                type: 'object',
                name,
                ast: generateAstFromDeclaration(compiler, declaration)
            };

            return property;
        }
    }

    function getArrayTypeNode(
        name: string,
        node: ArrayTypeNode
    ): MockArrayProperty {
        const elementType = resolveNodeType('ARRAY', node.elementType);

        const property: MockArrayProperty = {
            type: 'array',
            name,
            elementType
        };

        return property;
    }

    function resolveNodeType(name: string, node: TypeNode): MockProperty {
        if (isTypeLiteralNode(node)) {
            return getInlineObjectNode(name, node);
        }
        // FIXME: eh
        if (isTypeReferenceNode(node)) {
            try {
                return getTypeReferenceNode(name, node);
            } catch (err) {}
        }

        if (isArrayTypeNode(node)) {
            return getArrayTypeNode(name, node);
        }
        return getLiteralProperty(name, node);
    }

    return (node: PropertySignature) => {
        const name = node.name.getText();
        const property = resolveNodeType(name, node.type);
        return property;
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
