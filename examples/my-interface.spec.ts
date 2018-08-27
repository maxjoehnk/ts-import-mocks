import 'mocha';
import { expect } from 'chai';
import { MyInterface } from './my-interface';
import { requireMock } from '../src';

const generator = requireMock<MyInterface>('./my-interface');

describe('simple example', () => {
	it('should return an instance of the interface', () => {
		const mock = generator.generate();

		expect(mock.id).to.be.a('number');
		expect(mock.randomString).to.be.a('string');
	});
});
