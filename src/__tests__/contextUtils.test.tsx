import { createCtx } from '../contextUtils'

interface FooContextType {
	foo: string
	setFoo: (value: boolean) => void
}

describe('createCtx', () => {
	it('returns a custom context hook and a React context Provider', () => {
		const [useFooCtx, FooProvider] = createCtx<FooContextType>()
		expect(useFooCtx).toBeTruthy()
		expect(FooProvider).toBeTruthy()
	})
})
