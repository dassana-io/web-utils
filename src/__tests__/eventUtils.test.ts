import { Emitter, ev } from '../eventUtils'

describe('emitter', () => {
	let emitter: Emitter
	let emitSpy: jest.SpyInstance
	let offSpy: jest.SpyInstance
	let onSpy: jest.SpyInstance

	const mockEventValueA = 'bar'
	const mockEventValueB = 'baz'
	const mockCallback = jest.fn()
	const mockEvent = 'foo'

	beforeEach(() => {
		emitter = new Emitter()

		emitSpy = jest.spyOn(emitter, 'emit')
		offSpy = jest.spyOn(emitter, 'off')
		onSpy = jest.spyOn(emitter, 'on')
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should have an emit method', () => {
		emitter.emit(mockEvent, mockEventValueA)

		expect(emitSpy).toHaveBeenCalledWith(mockEvent, mockEventValueA)
	})

	it('should have an off method that removes the listener', () => {
		emitter.on(mockEvent, mockCallback)
		emitter.emit(mockEvent, mockEventValueA)

		expect(mockCallback).toHaveBeenCalledWith(mockEventValueA)

		emitter.off(mockEvent, mockCallback)

		expect(offSpy).toHaveBeenCalledWith(mockEvent, mockCallback)

		emitter.emit(mockEvent, mockEventValueB)

		expect(mockCallback).not.toHaveBeenLastCalledWith(mockEventValueB)
	})

	it('should have an on method that invokes the callback when the corresponding event is emitted', () => {
		emitter.on(mockEvent, mockCallback)

		expect(onSpy).toHaveBeenCalledWith(mockEvent, mockCallback)

		emitter.emit(mockEvent, mockEventValueA)

		expect(mockCallback).toHaveBeenCalledWith(mockEventValueA)
	})

	it('should have an emitNotficationMethod that calls the internal emit method', () => {
		emitter.emitNotificationEvent(ev.error, mockEventValueA)

		expect(emitSpy).toHaveBeenCalledWith(ev.error, {
			message: mockEventValueA
		})
	})

	it('should be able to clear all listeners at once', () => {
		const anotherMockEvent = 'lorem'
		const anotherMockCallback = jest.fn()

		const emitEvents = () => {
			emitter.emit(mockEvent, mockEventValueA)
			emitter.emit(anotherMockEvent, mockEventValueB)
		}

		emitter.on(mockEvent, mockCallback)
		emitter.on(anotherMockEvent, anotherMockCallback)

		emitEvents()

		expect(mockCallback).toHaveBeenCalledTimes(1)
		expect(anotherMockCallback).toHaveBeenCalledTimes(1)

		emitter.all.clear()
		emitEvents()

		emitter.all

		expect(mockCallback).toHaveBeenCalledTimes(1)
		expect(anotherMockCallback).toHaveBeenCalledTimes(1)
	})
})
