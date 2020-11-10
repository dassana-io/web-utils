const localStorageMock = () => {
	let storage: { [key: string]: string } = {}

	return {
		clear: (): void => {
			storage = {}
		},
		getItem: (key: string) => (key in storage ? storage[key] : null),
		key: (i: number) => {
			const keys = Object.keys(storage)

			return keys[i] || null
		},
		get length(): number {
			return Object.keys(storage).length
		},
		removeItem: (key: string): void => {
			delete storage[key]
		},
		setItem: (key: string, value: string): void => {
			if (value) {
				storage[key] = value
			}
		}
	}
}

export const initializeLocalStorageMock = () => {
	Object.defineProperty(window, 'localStorage', {
		value: localStorageMock(),
		writable: true
	})
}

const mockEmit = jest.fn()
const mockEmitNotificationEvent = jest.fn()
const mockEmitterOff = jest.fn()
const mockEmitterOn = jest.fn()

const mockEmitter = {
	emit: mockEmit,
	emitNotificationEvent: mockEmitNotificationEvent,
	off: mockEmitterOff,
	on: mockEmitterOn
} as jest.Mocked<any>

export {
	mockEmit,
	mockEmitNotificationEvent,
	mockEmitterOff,
	mockEmitterOn,
	mockEmitter
}
