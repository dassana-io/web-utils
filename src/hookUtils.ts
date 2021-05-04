import { Emitter, EmitterEventTypes } from 'eventUtils'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'

export const usePrevious = <T>(state: T): T | undefined => {
	const ref = useRef<T>()

	useEffect(() => {
		ref.current = state
	})

	return ref.current
}

// -----------------------------------
type KeyboardEventTypes = 'keydown' | 'keyup'

interface CommonUseShorcutConfig {
	additionalConditionalFn?: () => boolean
	callback: () => void
	preventDefault?: boolean
}

export interface MultipleKeysUseShorcut extends CommonUseShorcutConfig {
	// For now keys can only inlcude two keys. If adding more than two keys, read this first https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key/27512489#27512489
	keys: [KeyboardEvent['key'], KeyboardEvent['key']]
}

export interface SingleKeyUseShorcut extends CommonUseShorcutConfig {
	key: KeyboardEvent['key']
	keyEvent: KeyboardEventTypes
}

export type UseShortcutConfig = SingleKeyUseShorcut | MultipleKeysUseShorcut

export const useShortcut = ({
	additionalConditionalFn = () => true,
	callback,
	preventDefault = false,
	...rest
}: UseShortcutConfig) => {
	const [isFirstKeyPressed, setIsFirstKeyPressed] = useState(false)

	useEffect(() => {
		// If shortcut uses single key, a keyEvent is provided - use onKeyEvent and attach it to window
		if ('key' in rest) {
			const { key, keyEvent } = rest

			const onKeyEvent = (event: KeyboardEvent) => {
				// This prevents callback from being called if a key is pressed continuosly without lifting finger
				if (event.repeat) return

				if (event.key === key && additionalConditionalFn()) {
					callback()

					if (preventDefault) event.preventDefault()
				}
			}

			window.addEventListener(keyEvent, onKeyEvent)

			return () => window.removeEventListener(keyEvent, onKeyEvent)
			// Otherwise shortcut uses multiple keys. We need to use both onKeyDown and onKeyUp to know which keys have been pressed
		} else {
			const [firstKey, secondKey] = rest.keys

			const onKeyDown = (event: KeyboardEvent) => {
				if (event.repeat) return

				if (event.key === firstKey) setIsFirstKeyPressed(true)
				else if (
					isFirstKeyPressed &&
					event.key === secondKey &&
					additionalConditionalFn()
				) {
					callback()

					if (preventDefault) event.preventDefault()
				}
			}

			const onKeyUp = (event: KeyboardEvent) => {
				if (firstKey === event.key) setIsFirstKeyPressed(false)
			}

			window.addEventListener('keydown', onKeyDown)
			window.addEventListener('keyup', onKeyUp)

			return () => {
				window.removeEventListener('keydown', onKeyDown)
				window.removeEventListener('keyup', onKeyUp)
			}
		}
	}, [
		additionalConditionalFn,
		callback,
		isFirstKeyPressed,
		preventDefault,
		rest
	])
}

// -----------------------------------

export const useQueryParams = <T extends string>() => {
	const query = new URLSearchParams(window.location.search)

	const getParam = (key: T) => query.get(key)

	return {
		getParam
	}
}

// -----------------------------------

export enum ThemeType {
	dark = 'dark',
	light = 'light'
}

export const useTheme = (emitter: Emitter) => {
	const getLocalStorageTheme = () =>
		(localStorage.getItem('theme') as ThemeType) || ThemeType.dark
	const [theme, setTheme] = useState<ThemeType>(getLocalStorageTheme())

	const onStorageUpdate = useCallback(() => {
		const themeInStorage = getLocalStorageTheme()

		if (themeInStorage !== theme) {
			setTheme(themeInStorage)
		}
	}, [theme])

	useLayoutEffect(() => {
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
