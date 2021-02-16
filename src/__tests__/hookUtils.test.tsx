import { fireEvent } from '@testing-library/react'
import { initializeLocalStorageMock } from '../testUtils'
import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { Emitter, EmitterEventTypes } from '../eventUtils'
import { mount, ReactWrapper } from 'enzyme'
import {
	ThemeType,
	usePrevious,
	useShortcut,
	UseShortcutConfig,
	useTheme
} from '../hookUtils'

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

// TODO: Increase test-coverage to 100%
describe('useShortcut', () => {
	let wrapper: ReactWrapper

	const onKeyEventCbSpy = jest.fn()
	jest.spyOn(window, 'addEventListener')
	jest.spyOn(window, 'removeEventListener')

	describe('single key', () => {
		const options: UseShortcutConfig = {
			callback: onKeyEventCbSpy,
			key: 'Escape',
			keyEvent: 'keydown'
		}

		const MockComponent = () => {
			useShortcut(options)

			return <div />
		}

		beforeEach(() => {
			wrapper = mount(<MockComponent />)
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('adds a keydown event listener on mount', () => {
			expect(window.addEventListener).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			)
		})

		it('removes the keydown event listener when unmounted', () => {
			wrapper.unmount()

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			)
		})

		it('should invoke the key event callback function if the correct key is pressed', () => {
			act(() => {
				dispatchEvent(
					new KeyboardEvent('keydown', {
						code: 'Escape',
						key: 'Escape'
					})
				)
			})

			expect(onKeyEventCbSpy).toHaveBeenCalled()
		})

		it('should not invoke the key event callback function if other keys are pressed', () => {
			act(() => {
				dispatchEvent(
					new KeyboardEvent('keydown', {
						ctrlKey: true
					})
				)
			})

			expect(onKeyEventCbSpy).not.toHaveBeenCalled()
		})

		it('should not invoke the key event callback function if the additional condition is not met', () => {
			const mockFn = jest.fn()

			const MockComponent = () => {
				useShortcut({
					...options,
					additionalConditionalFn: () => false,
					callback: mockFn
				})

				return <div />
			}

			wrapper = mount(<MockComponent />)

			wrapper.update()

			act(() => {
				dispatchEvent(
					new KeyboardEvent('keydown', {
						code: 'Escape',
						key: 'Escape'
					})
				)
			})

			expect(mockFn).not.toHaveBeenCalled()
		})
	})

	describe('multiple keys', () => {
		const options: UseShortcutConfig = {
			callback: onKeyEventCbSpy,
			keys: ['Meta', 'a']
		}

		const MockComponent = () => {
			useShortcut(options)

			return <div />
		}

		beforeEach(() => {
			wrapper = mount(<MockComponent />)
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('adds a keydown and keyup event listener on mount', () => {
			expect(window.addEventListener).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			)

			expect(window.addEventListener).toHaveBeenCalledWith(
				'keyup',
				expect.any(Function)
			)
		})

		it('removes the keydown and keyup event listener when unmounted', () => {
			wrapper.unmount()

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			)

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'keyup',
				expect.any(Function)
			)
		})

		it('should invoke the key event callback function if the correct keys are pressed', () => {
			act(() => {
				fireEvent.keyDown(window, {
					code: 'Meta',
					key: 'Meta'
				})
			})

			act(() => {
				fireEvent.keyDown(window, {
					code: 'KeyA',
					key: 'a'
				})
			})

			expect(onKeyEventCbSpy).toHaveBeenCalled()
		})

		it('should not invoke the key event callback function if other keys are pressed', () => {
			act(() => {
				fireEvent.keyDown(window, {
					code: 'Shift',
					key: 'Shift'
				})
			})

			expect(onKeyEventCbSpy).not.toHaveBeenCalled()
		})

		it('should not invoke the key event callback function if the additional condition is not met', () => {
			const mockFn = jest.fn()

			const MockComponent = () => {
				useShortcut({
					...options,
					additionalConditionalFn: () => false,
					callback: mockFn
				})

				return <div />
			}

			wrapper = mount(<MockComponent />)

			wrapper.update()

			act(() => {
				fireEvent.keyDown(window, {
					code: 'Meta',
					key: 'Meta'
				})
			})

			act(() => {
				fireEvent.keyDown(window, {
					code: 'KeyA',
					key: 'a'
				})
			})

			expect(mockFn).not.toHaveBeenCalled()
		})

		it('should not keep track of keys that have been unpressed', () => {
			act(() => {
				fireEvent.keyDown(window, {
					code: 'Meta',
					key: 'Meta'
				})
			})

			act(() => {
				fireEvent.keyUp(window, {
					code: 'Meta',
					key: 'Meta'
				})
			})

			act(() => {
				fireEvent.keyDown(window, {
					code: 'KeyA',
					key: 'a'
				})
			})

			expect(onKeyEventCbSpy).not.toHaveBeenCalled()
		})
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
