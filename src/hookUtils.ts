import { Emitter, EmitterEventTypes } from 'eventUtils'
import { useCallback, useEffect, useRef, useState } from 'react'

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

export enum ThemeType {
	dark = 'dark',
	light = 'light'
}

export const useTheme = (emitter: Emitter) => {
	const [theme, setTheme] = useState<ThemeType>(ThemeType.dark)

	const getLocalStorageTheme = () =>
		(localStorage.getItem('theme') as ThemeType) || ThemeType.dark

	const onStorageUpdate = useCallback(() => {
		const themeInStorage = getLocalStorageTheme()

		if (themeInStorage !== theme) {
			setTheme(themeInStorage)
		}
	}, [theme])

	useEffect(() => {
		const theme = getLocalStorageTheme()

		setTheme(theme)
	}, [])

	useEffect(() => {
		emitter.on(EmitterEventTypes.themeUpdated, onStorageUpdate)

		return () =>
			emitter.off(EmitterEventTypes.themeUpdated, onStorageUpdate)
	}, [emitter, onStorageUpdate])

	return theme
}
