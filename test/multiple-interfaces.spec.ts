import 'mocha';
import { expect } from 'chai';
import { Category, Product } from './multiple-interfaces';
import { requireMocks } from '../src';
import { MockGenerator } from '../src/generator';

const {
    CategoryMock,
    ProductMock
}: {
    CategoryMock: MockGenerator<Category>;
    ProductMock: MockGenerator<Product>;
} = <any>requireMocks('./multiple-interfaces');

describe('Multiple Interfaces', () => {
    describe('ProductMock', () => {
        it('should return an instance of the interface', () => {
            const mock = ProductMock.generate();

            expect(mock.id).to.be.a('number');
            expect(mock.category.id).to.be.a('number');
        });
    });

    describe('CategoryMock', () => {
        it('should return an instance of the interface', () => {
            const mock = CategoryMock.generate();

            expect(mock.id).to.be.a('number');
            expect(mock.name).to.be.a('string');
        });
    });
});
