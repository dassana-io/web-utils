import { createCtx } from '../contextUtils'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

interface FooCtxType {
	foo: string
	onFoo: (value: boolean) => void
}

interface TestProviderProps {
	children: ReactNode
}

const [useFooCtx, FooProvider] = createCtx<FooCtxType>()

const getWrapperComponent = (initialValues?: FooCtxType) => ({
	children
}: TestProviderProps) => (
	<FooProvider value={initialValues}>{children}</FooProvider>
)

let wrapper: React.FC<TestProviderProps>

describe('createCtx', () => {
	it('throws an error if initial values are not provided', () => {
		wrapper = getWrapperComponent()

		renderHook(() => expect(useFooCtx()).toThrow(), { wrapper })
	})

	it('uses custom hook if initial values are provided', () => {
		wrapper = getWrapperComponent({
			foo: 'bar',
			onFoo: foo => console.log(foo)
		})

		const { result } = renderHook(() => useFooCtx(), { wrapper })

		expect(result.current.foo).toBe('bar')
		expect(typeof result.current.onFoo).toBe('function')
	})
})
