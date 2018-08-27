import 'mocha';
import { expect } from 'chai';
import { BasicInterface } from './basic-interface';
import { requireMock } from '../src';

const generator = requireMock<BasicInterface>('./basic-interface');

describe('BasicInterface', () => {
    it('should return an instance of the interface', () => {
        const mock = generator.generate();

        expect(mock.id).to.be.a('number');
        expect(mock.randomString).to.be.a('string');

        expect(mock.futureDate).to.be.an.instanceOf(Date);
        expect(mock.pastDate).to.be.an.instanceOf(Date);
        expect(mock.randomDate).to.be.an.instanceOf(Date);
    });
});
