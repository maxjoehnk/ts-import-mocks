import { MockGenerator } from './generator';
import { generateSingleAst, generateMultipleAsts } from './parser';
import { resolve, parse } from 'path';
import { MockGenerators } from './contracts';

export function importMock<T>(filename: string): MockGenerator<T> {
    const { dir } = parse(module.parent.filename);
    const path = resolve(dir, filename);

    const ast = generateSingleAst(`${path}.ts`);
    return new MockGenerator<T>(ast);
}

export function importMocks(filename: string): MockGenerators {
    const { dir } = parse(module.parent.filename);
    const path = resolve(dir, filename);

    const asts = generateMultipleAsts(`${path}.ts`);

    const generators: MockGenerators = {};

    for (const name of Object.getOwnPropertyNames(asts)) {
        generators[`${name}Mock`] = new MockGenerator<any>(asts[name]);
    }

    return generators;
}
