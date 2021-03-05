import { initializeLocalStorageMock } from '../../testUtils'
import { act, renderHook } from '@testing-library/react-hooks'
import { Emitter, EmitterEventTypes } from '../../eventUtils'
import { ThemeType, usePrevious, useTheme } from '../../hookUtils'

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
