import 'mocha';
import { expect } from 'chai';
import { NestedInterface } from './nested-interface';
import { requireMock } from '../src';

const generator = requireMock<NestedInterface>('./nested-interface');

describe('NestedInterface', () => {
    it('should return an instance of the interface', () => {
        const mock = generator.generate();

        expect(mock.uuid).to.be.uuid('v4');
        expect(mock.user.uuid).to.be.uuid('v4');
        expect(mock.user.firstName).to.be.a('string');
        expect(mock.user.lastName).to.be.a('string');
    });
});
