import omit from 'lodash/omit'
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
}

export interface MultipleKeysUseShorcut extends CommonUseShorcutConfig {
	keys: [KeyboardEvent['key'], ...KeyboardEvent['key'][]]
}

export interface SingleKeyUseShorcut extends CommonUseShorcutConfig {
	key: KeyboardEvent['key']
	keyEvent: KeyboardEventTypes
}

export type UseShortcutConfig = SingleKeyUseShorcut | MultipleKeysUseShorcut

interface PressedKeysMap {
	[key: string]: boolean | undefined
}

export const useShortcut = ({
	additionalConditionalFn = () => true,
	callback,
	...rest
}: UseShortcutConfig) => {
	// for multiple keys only. this keeps track of which keys are currently being pressed.
	const [pressedKeysMap, setPressedKeysMap] = useState<PressedKeysMap>({})

	useEffect(() => {
		// If shortcut uses single key, a keyEvent is provided - use onKeyEvent and attach it to window
		if ('key' in rest) {
			const { key, keyEvent } = rest

			const onKeyEvent = (event: KeyboardEvent) => {
				// This prevents callback from being called if a key is pressed continuosly without lifting finger
				if (event.repeat) return

				if (event.key === key && additionalConditionalFn()) {
					callback()
				}
			}

			window.addEventListener(keyEvent, onKeyEvent)

			return () => window.removeEventListener(keyEvent, onKeyEvent)
			// Otherwise shortcut uses multiple keys. We need to use both onKeyDown and onKeyUp to know which keys have been pressed
		} else {
			const { keys = [] } = rest

			const onKeyDown = (event: KeyboardEvent) => {
				if (event.repeat) return

				let currPressedKey = ''
				let allKeysPressed = false

				const clonedPressedKeysMap = { ...pressedKeysMap }

				// Check if pressed key matches any of the ones from list provided
				if (keys.find(key => key === event.key)) {
					clonedPressedKeysMap[event.key] = true

					currPressedKey = event.key
				}

				// If all the keys are being pressed, set allKeysPressed to true
				if (keys.every(key => clonedPressedKeysMap[key]))
					allKeysPressed = true

				// If all keys are pressed and conditions are met, call the callback
				// and set the last pressed key to false
				if (allKeysPressed && additionalConditionalFn()) {
					callback()
					// This is needed for modifier keys. More info: https://en.wikipedia.org/wiki/Rollover_(key)
					if (currPressedKey)
						clonedPressedKeysMap[currPressedKey] = false
				}

				setPressedKeysMap(clonedPressedKeysMap)
			}

			const onKeyUp = (event: KeyboardEvent) => {
				if (keys.find(key => key === event.key))
					setPressedKeysMap(prev => omit(prev, event.key))
			}

			window.addEventListener('keydown', onKeyDown)
			window.addEventListener('keyup', onKeyUp)

			return () => {
				window.removeEventListener('keydown', onKeyDown)
				window.removeEventListener('keyup', onKeyUp)
			}
		}
	}, [additionalConditionalFn, callback, pressedKeysMap, rest])
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
