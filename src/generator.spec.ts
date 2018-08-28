import 'mocha';
import { expect, use } from 'chai';
import { MockAst, MockDataGenerator, MockGenerator } from './generator';
import chaiUuid = require('chai-uuid');

use(chaiUuid);

describe('generator', () => {
    it('should generate a number', () => {
        interface NumberTest {
            numberTest: number;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'number',
                    name: 'numberTest'
                }
            ]
        };
        const generator = new MockGenerator<NumberTest>(ast);
        const mock = generator.generate();

        expect(mock.numberTest).to.be.a('number');
    });

    it('should generate a string', () => {
        interface StringTest {
            stringTest: string;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'string',
                    name: 'stringTest'
                }
            ]
        };

        const generator = new MockGenerator<StringTest>(ast);
        const mock = generator.generate();

        expect(mock.stringTest).to.be.a('string');
    });

    it('should generate a boolean', () => {
        interface BooleanTest {
            booleanTest: boolean;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'boolean',
                    name: 'booleanTest'
                }
            ]
        };

        const generator = new MockGenerator<BooleanTest>(ast);
        const mock = generator.generate();

        expect(mock.booleanTest).to.be.a('boolean');
    });

    it('should generate a uuid', () => {
        interface UuidTest {
            uuidTest: string;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'string',
                    generator: MockDataGenerator.UUID,
					name: 'uuidTest'
                }
            ]
        };

        const generator = new MockGenerator<UuidTest>(ast);
        const mock = generator.generate();

        expect(mock.uuidTest).to.be.uuid('v4');
    });

    it('should generate unique ids', () => {
        interface IdTest {
            id: number;
            userId: number;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'number',
                    generator: MockDataGenerator.ID,
                    name: 'id'
                },
                {
                    type: 'number',
                    generator: MockDataGenerator.ID,
                    name: 'userId'
                }
            ]
        };

        const generator = new MockGenerator<IdTest>(ast);
        const mock1 = generator.generate();
        const mock2 = generator.generate();

        expect(mock1.id).not.to.eql(mock2.id);
        expect(mock1.userId).not.to.eql(mock2.userId);
    });

    it('should generate string ids', () => {
        interface IdTest {
            id: string;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'string',
                    generator: MockDataGenerator.ID,
                    name: 'id'
                }
            ]
        };

        const generator = new MockGenerator<IdTest>(ast);
        const mock = generator.generate();
        expect(mock.id).to.be.a('string');
    });
});
