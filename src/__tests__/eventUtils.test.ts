import mitt from 'mitt'
import {
	dassanaEmitter,
	DassanaEventTypes,
	emitNotificationEvent
} from '../eventUtils'

jest.mock('mitt')

const mockEmitter = {
	emit: jest.fn()
}

describe('dassanaEmitter', () => {
	it('should return an instance of an event emitter', () => {
		dassanaEmitter

		expect(mitt).toHaveBeenCalled()
	})
})

describe('emitNotificationEvent', () => {
	const mockMessage = 'foo'

	emitNotificationEvent(
		DassanaEventTypes.error,
		mockMessage,
		mockEmitter as any
	)

	expect(mockEmitter.emit).toHaveBeenCalledWith(DassanaEventTypes.error, {
		message: mockMessage
	})
})
