import { initializeLocalStorageMock } from '../../testUtils'
import { renderHook } from '@testing-library/react'
import {
	useDebounce,
	useIsJSONStrValid,
	usePrevious,
	useQueryParams
} from '../../hookUtils'

const mockBrowserLocation = {
	search: '?view=manage&alertId=P-1234&cloud-type=aws&cloud-type=azure'
}

initializeLocalStorageMock()

const mockSetTimeout = () => {
	jest.useFakeTimers()
	jest.spyOn(global, 'setTimeout')
}

const mockClearTimeout = () => {
	jest.useFakeTimers()
	jest.spyOn(global, 'clearTimeout')
}

describe('useDebounce', () => {
	afterEach(() => {
		jest.useRealTimers()
	})

	test('should return debounce value', () => {
		const value = 'value'
		const {
			result: { current: debounceValue }
		} = renderHook(() => useDebounce(value))

		expect(value).toBe(debounceValue)
	})

	test('should debounce with default debounce 250 ms', () => {
		mockSetTimeout()
		renderHook(() => useDebounce('value'))

		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250)
	})

	test('should debounce with given debounce', () => {
		mockSetTimeout()
		renderHook(() => useDebounce('value', 1337))

		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1337)
	})

	test('should call clearTimeout on unmount', () => {
		mockClearTimeout()
		const { unmount } = renderHook(() => useDebounce('value'))
		unmount()

		expect(clearTimeout).toHaveBeenCalledTimes(1)
	})
})

describe('useIsJSONStrValid', () => {
	const initializeHook = (jsonStr: string, cb?: () => void) =>
		renderHook(() => useIsJSONStrValid(jsonStr, cb))

	it('should return false for invalid json', () => {
		const { result } = initializeHook('foo')

		expect(result.current).toBeFalsy()
	})

	it('should return true for invalid json', () => {
		const { result } = initializeHook('{"foo":"bar"}')

		expect(result.current).toBe(true)
	})

	it('should invoke the callback on success if one is passed in', () => {
		const mockCb = jest.fn()
		initializeHook('{"foo":"bar"}', mockCb)

		expect(mockCb).toHaveBeenCalled()
	})
})

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
