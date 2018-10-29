import 'mocha';
import { expect, use } from 'chai';
import { RootLayer, FirstLayer, SecondLayer } from './multiple-interfaces';
import { importMocks } from '../src';
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
} = <any>importMocks('./multiple-interfaces');

describe('Multiple Interfaces', () => {
    describe('RootLayerMock', () => {
        it('should return an instance of the interface', () => {
            const mock = RootLayerMock.generate();

            expect(mock.uuid).to.be.uuid('v4');
            expect(mock.name).to.be.a('string');

            expect(mock.firstLayer.uuid).to.be.uuid('v4');
            expect(mock.firstLayer.name).to.be.a('string');

            expect(mock.firstLayer.secondLayer.uuid).to.be.uuid('v4');
            expect(mock.firstLayer.secondLayer.name).to.be.a('string');

            expect(mock.arrayLayer).to.be.array();
            for (const arrayLayer of mock.arrayLayer) {
                expect(arrayLayer.uuid).to.be.uuid('v4');
            }
        });
    });
});
