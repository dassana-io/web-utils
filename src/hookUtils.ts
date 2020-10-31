import { add } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

export const usePrevious = <T>(state: T): T | undefined => {
	const ref = useRef<T>()

	useEffect(() => {
		ref.current = state
	})

	return ref.current
}

type KeyboardEventTypes = 'keydown' | 'keyup'

export interface UseShortcutConfig {
	additionalConditionalFn?: () => boolean
	callback: () => void
	key: KeyboardEvent['key']
	keyEvent: KeyboardEventTypes
}

export const useShortcut = ({
	additionalConditionalFn = () => true,
	callback,
	key,
	keyEvent
}: UseShortcutConfig) => {
	const onKeyEvent = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === key && additionalConditionalFn()) {
				callback()
			}
		},
		[additionalConditionalFn, callback, key]
	)

	useEffect(() => {
		window.addEventListener(keyEvent, onKeyEvent)

		return () => window.removeEventListener(keyEvent, onKeyEvent)
	}, [keyEvent, onKeyEvent])
}
