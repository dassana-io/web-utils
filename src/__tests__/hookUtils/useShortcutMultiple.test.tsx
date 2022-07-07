import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { useShortcut, UseShortcutConfig } from '../../hookUtils'

const onKeyEventCbSpy = jest.fn()
jest.spyOn(window, 'addEventListener')
jest.spyOn(window, 'removeEventListener')

// TODO: Increase test-coverage to 100%
describe('useShortcut', () => {
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
			render(<MockComponent />)
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
			const { unmount } = render(<MockComponent />)

			unmount()

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
