import { MockGenerator } from './generator';
import { generateAst } from './parser';
import * as callsite from 'callsite';
import { resolve, parse } from 'path';

export function requireMock<T>(filename: string): MockGenerator<T> {
    const [_, callee] = callsite();
    const { dir } = parse(callee.getFileName());
    const path = resolve(dir, filename);

    const ast = generateAst(`${path}.ts`);
    return new MockGenerator<T>(ast);
}
