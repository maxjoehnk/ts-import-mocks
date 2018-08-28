import * as faker from 'faker';
import {
    MockAst,
    MockProperty,
    MockDataGenerator,
    IMockGenerator
} from './contracts';

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
            if (property.type === 'object') {
                mock[property.name] = this.generateAst(property.ast);
            } else {
                mock[property.name] = this.generateProperty(property);
            }
        }

        return mock;
    }

    private generateProperty(property: MockProperty): any {
        if ('generator' in property) {
            return this.generateCustomProperty(property);
        }

        switch (property.type) {
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

    private generateCustomProperty(property: MockProperty): any {
        switch (property.generator) {
            case MockDataGenerator.ID:
                return convertValue(
                    this.generateId(property.name),
                    property.type
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
