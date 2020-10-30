import { useCallback, useEffect, useRef } from 'react'

export const usePrevious = <T>(state: T): T | undefined => {
	const ref = useRef<T>()

	useEffect(() => {
		ref.current = state
	})

	return ref.current
}

type KeyboardEventTypes = 'keydown' | 'keyup'

export const useShortcut = (
	keyEvent: KeyboardEventTypes,
	key: KeyboardEvent['key'],
	callback: () => void
) => {
	const onKeyEvent = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === key) {
				callback()
			}
		},
		[callback, key]
	)

	useEffect(() => {
		window.addEventListener(keyEvent, onKeyEvent)

		return () => window.removeEventListener(keyEvent, onKeyEvent)
	}, [keyEvent, onKeyEvent])
}
