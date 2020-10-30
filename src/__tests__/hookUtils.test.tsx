import { act } from 'react-dom/test-utils'
import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { mount, ReactWrapper } from 'enzyme'
import { usePrevious, useShortcut } from '../hookUtils'

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

describe('useShortcut', () => {
	let wrapper: ReactWrapper

	const onKeyEventCbSpy = jest.fn()
	jest.spyOn(window, 'addEventListener')
	jest.spyOn(window, 'removeEventListener')

	const MockComponent = () => {
		useShortcut('keydown', 'Escape', onKeyEventCbSpy)

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
			window.dispatchEvent(
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
})
