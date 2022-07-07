import { act } from '@testing-library/react-hooks'
import React from 'react'
import { render } from '@testing-library/react'
import { useShortcut, UseShortcutConfig } from '../../hookUtils'

const onKeyEventCbSpy = jest.fn()
jest.spyOn(window, 'addEventListener')
jest.spyOn(window, 'removeEventListener')

// TODO: Increase test-coverage to 100%
describe('useShortcut', () => {
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
			render(<MockComponent />)
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('removes the keydown event listener when unmounted', () => {
			const { unmount } = render(<MockComponent />)
			unmount()

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			)
		})

		it('adds a keydown event listener on mount', () => {
			expect(window.addEventListener).toHaveBeenCalledWith(
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
})
