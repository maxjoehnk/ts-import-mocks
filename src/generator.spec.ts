import 'mocha';
import { expect, use } from 'chai';
import { MockGenerator } from './generator';
import { MockAst, MockDataGenerator } from './contracts';
import chaiUuid = require('chai-uuid');
import chaiArrays = require('chai-arrays');

use(chaiUuid);
use(chaiArrays);

describe('generator', () => {
    it('should generate a number', () => {
        interface NumberTest {
            numberTest: number;
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'literal',
                    literalType: 'number',
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
                    type: 'literal',
                    literalType: 'string',
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
                    type: 'literal',
                    literalType: 'boolean',
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
                    type: 'literal',
                    literalType: 'string',
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
                    type: 'literal',
                    literalType: 'number',
                    generator: MockDataGenerator.ID,
                    name: 'id'
                },
                {
                    type: 'literal',
                    literalType: 'number',
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
                    type: 'literal',
                    literalType: 'string',
                    generator: MockDataGenerator.ID,
                    name: 'id'
                }
            ]
        };

        const generator = new MockGenerator<IdTest>(ast);
        const mock = generator.generate();
        expect(mock.id).to.be.a('string');
    });

    it('should generate a number array', () => {
        interface ArrayTest {
            array: number[];
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'array',
                    elementType: {
                        type: 'literal',
                        literalType: 'number',
                        name: ''
                    },
                    name: 'array'
                }
            ]
        };

        const generator = new MockGenerator<ArrayTest>(ast);
        const mock = generator.generate();
        expect(mock.array).to.be.array();
        for (const item of mock.array) {
            expect(item).to.be.a('number');
        }
    });

    it('should generate an array of objects', () => {
        interface ArrayTest {
            array: {
                id: number;
                name: string;
            }[];
        }

        const ast: MockAst = {
            properties: [
                {
                    type: 'array',
                    elementType: {
                        type: 'object',
                        name: 'Nested',
                        ast: {
                            name: 'Nested',
                            properties: [
                                {
                                    name: 'id',
                                    type: 'literal',
                                    literalType: 'number',
                                    generator: MockDataGenerator.ID
                                },
                                {
                                    name: 'name',
                                    type: 'literal',
                                    literalType: 'string'
                                }
                            ]
                        }
                    },
                    name: 'array'
                }
            ]
        };

        const generator = new MockGenerator<ArrayTest>(ast);
        const mock = generator.generate();
        expect(mock.array).to.be.array();
        for (const item of mock.array) {
            expect(item.id).to.be.a('number');
            expect(item.name).to.be.a('string');
        }
    });
});
