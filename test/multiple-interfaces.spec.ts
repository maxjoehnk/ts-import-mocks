import 'mocha';
import { expect, use } from 'chai';
import { RootLayer, FirstLayer, SecondLayer } from './multiple-interfaces';
import { requireMocks } from '../src';
import { MockGenerator } from '../src/generator';
import chaiArrays = require('chai-arrays');
import chaiUuid = require('chai-uuid');

use(chaiArrays);
use(chaiUuid);

const {
    RootLayerMock
}: {
    RootLayerMock: MockGenerator<RootLayer>;
    FirstLayerMock: MockGenerator<FirstLayer>;
    SecondLayerMock: MockGenerator<SecondLayer>;
} = <any>requireMocks('./multiple-interfaces');

describe('Multiple Interfaces', () => {
    describe('RootLayerMock', () => {
        it('should return an instance of the interface', () => {
            const mock = RootLayerMock.generate();

            expect(mock.id).to.be.a('number');
            expect(mock.name).to.be.a('string');

            expect(mock.firstLayer.id).to.be.a('number');
            expect(mock.firstLayer.name).to.be.a('string');

            expect(mock.firstLayer.secondLayer.id).to.be.a('number');
            expect(mock.firstLayer.secondLayer.name).to.be.a('string');

            expect(mock.arrayLayer).to.be.array();
            for (const arrayLayer of mock.arrayLayer) {
                expect(arrayLayer.id).to.be.a('number');
            }
        });
    });
});
