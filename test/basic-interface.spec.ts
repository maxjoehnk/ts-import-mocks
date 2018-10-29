import 'mocha';
import { expect, use } from 'chai';
import { BasicInterface } from './basic-interface';
import { importMock } from '../src';
import chaiArrays = require('chai-arrays');
import chaiUuid = require('chai-uuid');

use(chaiArrays);
use(chaiUuid);

const generator = importMock<BasicInterface>('./basic-interface');

describe('BasicInterface', () => {
    describe('should return an instance of the interface', () => {
        const mock = generator.generate();

        it('should generate a number', () => {
            expect(mock.id).to.be.a('number');
        });

        it('should generate an uuid', () => {
            expect(mock.uuid).to.be.uuid('v4');
        });

        it('should generate a string', () => {
            expect(mock.randomString).to.be.a('string');
        });

        it('should generate dates', () => {
            expect(mock.futureDate).to.be.an.instanceOf(Date);
            expect(mock.pastDate).to.be.an.instanceOf(Date);
            expect(mock.randomDate).to.be.an.instanceOf(Date);
        });

        it('should generate a varying length number array', () => {
            expect(mock.numberArray).to.be.array();
        });

        it('should generate a fixed length number array', () => {
            expect(mock.fixedLengthArray).to.be.ofSize(3);

            const [i1, i2, i3] = mock.fixedLengthArray;
            expect(i1).to.be.a('number');
            expect(i2).to.be.a('string');
            expect(i3).to.be.a('number');
        });
    });
});
