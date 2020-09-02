import { dassanaEmitter } from '../eventUtils'
import mitt from 'mitt'

jest.mock('mitt')

describe('dassanaEmitter', () => {
	it('should return an instance of an event emitter', () => {
		dassanaEmitter

		expect(mitt).toHaveBeenCalled()
	})
})
