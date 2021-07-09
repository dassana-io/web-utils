import { initializeLocalStorageMock } from '../../testUtils'
import { act, renderHook } from '@testing-library/react-hooks'
import { Emitter, EmitterEventTypes } from '../../eventUtils'
import {
	ThemeType,
	usePrevious,
	useQueryParams,
	useTheme
} from '../../hookUtils'

const mockBrowserLocation = {
	search: '?view=manage&alertId=P-1234&cloud-type=aws&cloud-type=azure'
}

initializeLocalStorageMock()

describe('usePrevious', () => {
	const initialProps = { state: 'foo' }

	const initializeHook = () =>
		renderHook(({ state }) => usePrevious<string>(state), {
			initialProps
		})

	it('should return undefined for initial render', () => {
		const { result } = initializeHook()

		expect(result.current).toBeUndefined()
	})

	it('should return the previous state after a rerender', () => {
		const { result, rerender } = initializeHook()

		rerender({ state: 'bar' })

		expect(result.current).toBe('foo')

		rerender({ state: 'baz' })

		expect(result.current).toBe('bar')
	})
})

describe('useQueryParams', () => {
	Object.defineProperty(window, 'location', {
		get() {
			return mockBrowserLocation
		}
	})

	const initializeHook = () => renderHook(useQueryParams)

	it('should return the correct query param value if the key exists', () => {
		const { result } = initializeHook()

		const alertId = result.current.getParam('alertId')

		expect(alertId).toEqual('P-1234')
	})

	it('should return null if the key does not exist in the query param', () => {
		const { result } = initializeHook()

		const alertId = result.current.getParam('id')

		expect(alertId).toBeNull()
	})

	it('should return params in an array if there are more than one', () => {
		const { result } = initializeHook()

		const cloudTypes = result.current.getParam('cloud-type')

		expect(cloudTypes).toMatchObject(['aws', 'azure'])
	})

	it('should return all params as an object', () => {
		const { result } = initializeHook()

		const params = result.current.params

		const expected = {
			alertId: ['P-1234'],
			'cloud-type': ['aws', 'azure'],
			view: ['manage']
		}

		expect(params).toMatchObject(expected)
	})
})

describe('useTheme', () => {
	const emitter = new Emitter()

	const offSpy = jest.spyOn(emitter, 'off')
	const onSpy = jest.spyOn(emitter, 'on')

	const initializeHook = () => renderHook(() => useTheme(emitter))

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should return dark theme if there is no theme in localStorage', () => {
		const { result } = initializeHook()

		expect(result.current).toBe(ThemeType.dark)
	})

	it('should add emitter listener on mount and remove it on unmount', () => {
		const { unmount } = initializeHook()

		expect(onSpy).toHaveBeenCalledWith(
			EmitterEventTypes.themeUpdated,
			expect.any(Function)
		)

		unmount()

		expect(offSpy).toHaveBeenCalledWith(
			EmitterEventTypes.themeUpdated,
			expect.any(Function)
		)
	})

	it('should update the theme when the appropriate event is emitted', () => {
		localStorage.setItem('theme', ThemeType.light)

		const { result } = initializeHook()

		expect(result.current).toBe(ThemeType.light)

		act(() => {
			localStorage.setItem('theme', ThemeType.dark)
			emitter.emit(EmitterEventTypes.themeUpdated, ThemeType.dark)
		})

		expect(result.current).toBe(ThemeType.dark)
	})

	it('should not update the theme if the theme in local storage is the same as the one in state', () => {
		localStorage.setItem('theme', ThemeType.light)

		const { result } = initializeHook()

		expect(result.current).toBe(ThemeType.light)

		act(() => {
			emitter.emit(EmitterEventTypes.themeUpdated, ThemeType.light)
		})

		expect(result.current).toBe(ThemeType.light)
	})
})
