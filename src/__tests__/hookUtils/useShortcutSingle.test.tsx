import { act } from '@testing-library/react-hooks'
import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { useShortcut, UseShortcutConfig } from '../../hookUtils'

let wrapper: ReactWrapper

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
			wrapper = mount(<MockComponent />)
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('removes the keydown event listener when unmounted', () => {
			wrapper.unmount()

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
})
