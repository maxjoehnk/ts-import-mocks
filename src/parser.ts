import { MockAst } from './generator';
import {
    Node,
    InterfaceDeclaration,
    isInterfaceDeclaration,
    SyntaxKind,
    ModifierFlags,
    getCombinedModifierFlags,
    createProgram
} from 'typescript';

export function generateAst(path: string): MockAst {
    const program = createProgram([path], {});

    const typeChecker = program.getTypeChecker();

    const file = program.getSourceFile(path);

    const interfaceDeclaration = findInterface(file);

    /*const properties: PropertyDeclaration[] = interfaceDeclaration
        .getChildren()
        .filter(isPropertyDeclaration);

    for (const property of properties) {
        console.log(property.name, property.type);
    }*/

    return {
        properties: []
    };
}

function findInterface(node: Node): InterfaceDeclaration {
    if (isInterfaceDeclaration(node) && isInterfaceExported(node)) {
        return <InterfaceDeclaration>node;
    }

    // if (isModuleDeclaration(node)) {
    for (const child of node.getChildren()) {
        const childInterface = findInterface(child);

        if (childInterface != null) {
            return childInterface;
        }
    }
    // }
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
