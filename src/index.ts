import { MockGenerator } from './generator';
import { generateSingleAst, generateMultipleAsts } from './parser';
import * as callsite from 'callsite';
import { resolve, parse } from 'path';
import { MockGenerators } from './contracts';

export function requireMock<T>(filename: string): MockGenerator<T> {
    const [_, callee] = callsite();
    const { dir } = parse(callee.getFileName());
    const path = resolve(dir, filename);

    const ast = generateSingleAst(`${path}.ts`);
    return new MockGenerator<T>(ast);
}

export function requireMocks(filename: string): MockGenerators {
    const [_, callee] = callsite();
    const { dir } = parse(callee.getFileName());
    const path = resolve(dir, filename);

    const asts = generateMultipleAsts(`${path}.ts`);

    const generators: MockGenerators = {};

    for (const name of Object.getOwnPropertyNames(asts)) {
        generators[`${name}Mock`] = new MockGenerator<any>(asts[name]);
    }

    return generators;
}
