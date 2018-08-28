export interface MockAst {
    name?: string;
    properties: MockProperty[];
}

export interface MockAsts {
    [name: string]: MockAst;
}

export interface MockGenerators {
    [name: string]: IMockGenerator<any>;
}

export interface IMockGenerator<T> {
    generate(): T;

    reset(): void;
}

export interface MockLiteralProperty {
    type: 'literal';
    generator?: MockDataGenerator;
    literalType: string;
    name: string;
}

export interface MockArrayProperty {
    type: 'array';
    name: string;
    elementType: MockProperty;
}

export interface MockTupleProperty {
    type: 'tuple';
    name: string;
    elementTypes: MockProperty[];
}

export interface MockObjectProperty {
    type: 'object';
    name: string;
    ast: MockAst;
}

export type MockProperty =
    | MockLiteralProperty
    | MockArrayProperty
    | MockObjectProperty
    | MockTupleProperty;

export enum MockDataGenerator {
    ID = 'id',
    UUID = 'uuid',
    FutureDate = 'date.future',
    PastDate = 'date.past',
    Iban = 'iban',
    FirstName = 'firstname',
    LastName = 'lastname'
}
