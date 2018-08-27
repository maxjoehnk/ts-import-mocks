import * as faker from 'faker';

export interface MockAst {
    properties: MockProperty[];
}

export interface MockProperty {
    generator?: MockDataGenerator;
    ast?: MockAst;
    type: 'string' | 'number' | 'boolean' | 'object';
    name: string;
}

export enum MockDataGenerator {
    ID = 'id',
    UUID = 'uuid'
}

export class MockGenerator<T> {
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
        }
    }

    private generateCustomProperty(property: MockProperty): any {
        switch (property.generator) {
            case MockDataGenerator.ID:
                return convertValue(
                    this.generateId(property.name),
                    property.type
                );
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
