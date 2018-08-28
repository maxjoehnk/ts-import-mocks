import * as faker from 'faker';
import {
    MockAst,
    MockDataGenerator,
    IMockGenerator,
    MockLiteralProperty,
    MockArrayProperty,
    MockProperty,
    MockTupleProperty
} from './contracts';

const MIN_ARRAY_ITEMS = 1;
const MAX_ARRAY_ITEMS = 100;

export class MockGenerator<T> implements IMockGenerator<T> {
    private ids: Map<string, number> = new Map();

    constructor(private ast: MockAst) {}

    public generate(): T {
        return this.generateAst(this.ast);
    }

    public reset(): void {
        for (const key of this.ids.keys()) {
            this.ids.set(key, 1);
        }
    }

    private generateAst(ast: MockAst): any {
        const mock: any = {};
        for (const property of ast.properties) {
            mock[property.name] = this.generateProperty(property);
        }

        return mock;
    }

    private generateProperty(property: MockProperty): any {
        switch (property.type) {
            case 'literal':
                return this.generateLiteral(property);
            case 'array':
                return this.generateArray(property);
            case 'object':
                return this.generateAst(property.ast);
            case 'tuple':
                return this.generateTuple(property);
        }
    }

    private generateArray(property: MockArrayProperty): any[] {
        const length = Math.max(
            MIN_ARRAY_ITEMS,
            faker.random.number(MAX_ARRAY_ITEMS)
        );
        return new Array(length)
            .fill(null)
            .map(() => this.generateProperty(property.elementType));
    }

    private generateTuple(property: MockTupleProperty): any[] {
        const { length } = property.elementTypes;
        return new Array(length)
            .fill(null)
            .map((_, i) => this.generateProperty(property.elementTypes[i]));
    }

    private generateLiteral(property: MockLiteralProperty): any {
        if (property.generator != null) {
            return this.generateCustomProperty(property);
        }

        switch (property.literalType) {
            case 'string':
                return faker.random.words();
            case 'number':
                return faker.random.number();
            case 'boolean':
                return faker.random.boolean();
            case 'Date':
                return new Date();
        }
    }

    private generateCustomProperty(property: MockLiteralProperty): any {
        switch (property.generator) {
            case MockDataGenerator.ID:
                return convertValue(
                    this.generateId(property.name),
                    property.literalType
                );
            case MockDataGenerator.UUID:
                return faker.random.uuid();
            case MockDataGenerator.FutureDate:
                return faker.date.future();
            case MockDataGenerator.PastDate:
                return faker.date.past();
            case MockDataGenerator.Iban:
                return faker.finance.iban();
            case MockDataGenerator.FirstName:
                return faker.name.firstName();
            case MockDataGenerator.LastName:
                return faker.name.lastName();
            default:
                throw new Error('Not implemented');
        }
    }

    private generateId(name: string): number {
        const id = this.ids.get(name) || faker.random.number();
        this.ids.set(name, id + 1);
        return id;
    }
}

function convertValue(value, target) {
    switch (target) {
        case 'string':
            return JSON.stringify(value);
        case 'number':
            return parseInt(value, 10);
    }
}
