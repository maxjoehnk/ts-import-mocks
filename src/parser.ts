import {
    MockAst,
    MockDataGenerator,
    MockProperty,
    MockAsts
} from './contracts';
import {
    createProgram,
    getCombinedModifierFlags,
    getLeadingCommentRanges,
    InterfaceDeclaration,
    isInterfaceDeclaration,
    isPropertySignature,
    isTypeLiteralNode,
    ModifierFlags,
    Node,
    PropertySignature,
    SyntaxKind,
    TypeChecker
} from 'typescript';

const commentAnnotationRegex = /#\[([a-z.]+)\]/;

export function generateSingleAst(path: string): MockAst {
    const program = createProgram([path], {});

    const typeChecker = program.getTypeChecker();

    const file = program.getSourceFile(path);
    const text = file.getText();

    const interfaceDeclaration = findInterface(file);

    const properties = interfaceDeclaration.members
        .filter(isPropertySignature)
        .map(getPropertyFromMember(typeChecker, text));

    return {
        properties
    };
}

export function generateMultipleAsts(path: string): MockAsts {
    const program = createProgram([path], {});

    const typeChecker = program.getTypeChecker();

    const file = program.getSourceFile(path);
    const text = file.getText();

    const interfaceDeclarations = findInterfaces(file);

    const asts = {};

    for (const interfaceDeclaration of interfaceDeclarations) {
        const name = interfaceDeclaration.name.getText();
        const properties = interfaceDeclaration.members
            .filter(isPropertySignature)
            .map(getPropertyFromMember(typeChecker, text));

        asts[name] = {
            properties
        };
    }

    console.log(JSON.stringify(asts));

    return asts;
}

function getPropertyFromMember(
    typeChecker: TypeChecker,
    text: string
): (node: PropertySignature) => MockProperty {
    function getProperty(node: PropertySignature): MockProperty {
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
                getPropertyFromMember(typeChecker, text)
            );

            property.ast = {
                properties
            };

            return property;
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
