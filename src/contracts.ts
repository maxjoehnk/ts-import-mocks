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

export interface MockProperty {
    generator?: MockDataGenerator;
    ast?: MockAst;
    type: string;
    name: string;
}

export enum MockDataGenerator {
    ID = 'id',
    UUID = 'uuid',
    FutureDate = 'date.future',
    PastDate = 'date.past',
    Iban = 'iban',
    FirstName = 'firstname',
    LastName = 'lastname'
}
