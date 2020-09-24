import { createContext, useContext } from 'react'

/* 
React's createContext expects an argument for the initial context value but often it doesn't make sense to pass a default. We initially pass undefined to get around this but things would break if a Provider didn't provide initial values. This function that wraps around createContext deals with the undefined check and returns a custom hook.
src: https://www.carlrippon.com/react-context-with-typescript-p4/
*/

/**
 * Generic function that creates and returns a custom context hook along with a Provider.
 * Example usage --> const [useExampleCtx, ExampleProvider] = createCtx<ExampleCtxType>()
 */
export const createCtx = <ContextType>() => {
	const ctx = createContext<ContextType | undefined>(undefined)

	const useCtx = () => {
		const c = useContext(ctx)

		if (!c) throw new Error('useCtx must be inside a Provider with a value')
		return c
	}

	return [useCtx, ctx.Provider] as const
}
