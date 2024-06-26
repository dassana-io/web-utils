import capitalize from 'lodash/capitalize'
import noop from 'lodash/noop'
import { OperatingSystems } from 'types'
import { processURLSearchParams } from 'generalUtils'
import { Breakpoints, modifierKeysMap, type WindowSize } from './constants'
import { type Emitter, EmitterEventTypes } from 'eventUtils'
import {
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'

// -----------------------------------

interface UseClickOutsideConfig {
	callback: (key?: string) => void
	/* The keys which will trigger the callback. Defaults to ['Escape'] */
	keys?: string[]
}

export const useClickOutside = ({
	callback,
	keys = ['Escape']
}: UseClickOutsideConfig) => {
	const ref = useRef(null)

	useEffect(() => {
		const keyListener = (e: KeyboardEvent) => {
			if (keys.includes(e.key)) callback(e.key)
		}

		const clickListener = (e: MouseEvent) => {
			if (ref.current && !(ref.current as any).contains(e.target)) {
				callback()
			}
		}

		document.addEventListener('click', clickListener)
		document.addEventListener('keyup', keyListener)

		return () => {
			document.removeEventListener('click', clickListener)
			document.removeEventListener('keyup', keyListener)
		}
	}, [keys, callback])

	return ref
}

// -----------------------------------

export const useDebounce = <T>(value: T, delay = 250) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => setDebouncedValue(value), delay)

			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed
			// within the delay period. Timeout gets cleared and restarted.
			return () => clearTimeout(handler)
		},
		[delay, value] // Only re-call effect if value or delay changes
	)

	return debouncedValue
}

// -----------------------------------

/**
 * Custom hook that tracks an element's height and width
 * Dimension outputs update on resize via observer
 */
export const useElementSize = (ref: RefObject<HTMLElement>) => {
	const [size, setElementSize] = useState<{
		height: number
		width: number
	}>({ height: 0, width: 0 })

	useLayoutEffect(() => {
		if (ref && ref.current) {
			const refCurr = ref.current

			const onResize = () => {
				const { height, width } = refCurr.getBoundingClientRect()

				setElementSize({ height, width })
			}

			// Create a new instance of ResizeObserver with onResize callback.
			const observer = new ResizeObserver(onResize)

			// observer will observe the element and fire the callback any time its size changes.
			observer.observe(refCurr)

			// Cleanup by unobserving the element and disconnecting observer.
			return () => {
				observer.unobserve(refCurr)
				observer.disconnect()
			}
		}
	}, [ref])

	return size
}

/**
 * Custom hook that informs when a div element is in view of the
 * browser viewport.
 */
export const useInView = () => {
	const ref = useRef<HTMLDivElement>(null)

	const [inView, setInView] = useState(false)

	/**
	 * This useEffect gets called on mount and creates an instance of
	 * IntersectionObserver. It keeps track of when an element enters
	 * and leaves the browser viewport.
	 */
	useEffect(() => {
		const refCurr = ref.current

		if (refCurr) {
			/**
			 * Callback passed into the IntersectionObserver() constructor.
			 * Since we're only observing one div element, check if only
			 * the first item - entries[0] is in view.
			 */
			const callback = ([entry]: IntersectionObserverEntry[]) =>
				setInView(entry.isIntersecting)

			/**
			 * The options object passed into the IntersectionObserver() constructor.
			 */
			const options = {
				/**
				 * The element that is used as the viewport for checking
				 * visibility of the target. Defaults to the browser viewport
				 * if not specified or if null.
				 */
				root: null,
				/**
				 * Either a single number or an array of numbers which indicate at
				 * what percentage of the target's visibility the observer's callback
				 * should be executed
				 */
				threshold: 0
			}

			const observer = new IntersectionObserver(callback, options)

			/**
			 * Observer will observe element passed as params and
			 * fire callback when it enters or leaves viewframe.
			 */
			observer.observe(refCurr)

			/**
			 * Cleanup by unobserving the element and disconnecting observer.
			 */
			return () => {
				observer.unobserve(refCurr)
				observer.disconnect()
			}
		}
	}, [])

	return { inView, ref }
}

// -----------------------------------

export const useIsJSONStrValid = (
	jsonStr: string,
	cb?: (json: Record<string, any>) => void
) => {
	const [jsonIsValid, setJsonIsValid] = useState(false)

	useEffect(() => {
		try {
			const parsedJson = JSON.parse(jsonStr)

			setJsonIsValid(true)

			if (cb) cb(parsedJson)
		} catch (error: any) {
			setJsonIsValid(false)
		}
	}, [cb, jsonStr])

	return jsonIsValid
}

// -----------------------------------

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
	// For now keys can only include two keys. If adding more than two keys, read this first https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key/27512489#27512489
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
				// This prevents callback from being called if a key is pressed continuously without lifting finger
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

				if (event.key === firstKey) {
					setIsFirstKeyPressed(true)
				} else if (
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

			const onWindowBlur = () => setIsFirstKeyPressed(false)

			window.addEventListener('keydown', onKeyDown)
			window.addEventListener('keyup', onKeyUp)
			window.addEventListener('blur', onWindowBlur)

			return () => {
				window.removeEventListener('keydown', onKeyDown)
				window.removeEventListener('keyup', onKeyUp)
				window.removeEventListener('blur', onWindowBlur)
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

export const getKeyboardKeyAndLabel = (
	key: SingleKeyUseShorcut['key'],
	os: OperatingSystems
) => {
	let label = capitalize(key)

	if (modifierKeysMap[key]) {
		label = modifierKeysMap[key][os].label
		key = modifierKeysMap[key][os].key
	}

	return {
		key,
		label
	}
}

export const isMacOS = () => window.navigator.userAgent.includes('Mac')

export const getModifierKeys = (keysArr: string[]) => {
	const os = isMacOS() ? OperatingSystems.mac : OperatingSystems.windows

	const keys: string[] = []
	const keyLabels: string[] = []

	keysArr.forEach(key => {
		const { key: keyCode, label } = getKeyboardKeyAndLabel(key, os)

		keys.push(keyCode)
		keyLabels.push(label)
	})

	return {
		keys: keys as MultipleKeysUseShorcut['keys'],
		label: keyLabels.join(' + ')
	}
}

// -----------------------------------

export const useQueryParams = <T extends string>() => {
	const query = new URLSearchParams(window.location.search)

	const getParam = (key: T) => {
		const params = query.getAll(key)

		if (params.length) {
			return params.length > 1 ? params : params[0]
		}

		return null
	}

	const getAllParams = () => processURLSearchParams(query)

	return {
		getParam,
		params: getAllParams()
	}
}

// -----------------------------------

export enum ThemeType {
	dark = 'dark',
	light = 'light'
}

export const useTheme = (emitter: Emitter): ThemeType => {
	const storedTheme = useMemo(
		() => (localStorage.getItem('theme') as ThemeType) ?? ThemeType.dark,
		[]
	)

	const [theme, setTheme] = useState<ThemeType>(storedTheme)

	const onThemeUpdate = useCallback(
		(newTheme: ThemeType) => setTheme(newTheme),
		[]
	)

	useEffect(() => {
		emitter.on(EmitterEventTypes.themeUpdated, onThemeUpdate)

		return () => emitter.off(EmitterEventTypes.themeUpdated, onThemeUpdate)
	}, [emitter, onThemeUpdate])

	return theme
}

// -----------------------------------

interface UseStopwatch {
	pauseStopwatch: () => void
	resetStopwatch: () => void
	resumeStopwatch: () => void
	startStopwatch: (reset?: boolean) => void
	time: number
}

export const useStopwatch = (interval = 10): UseStopwatch => {
	const [isActive, setIsActive] = useState(false)
	const [isPaused, setIsPaused] = useState(true)
	const [time, setTime] = useState(0)

	const stopwatchInterval = useRef<NodeJS.Timeout>()

	const startStopwatch = useCallback((reset?: boolean) => {
		if (reset) setTime(0)

		setIsActive(true)
		setIsPaused(false)
	}, [])

	const pauseStopwatch = useCallback(() => setIsPaused(true), [])
	const resumeStopwatch = useCallback(() => setIsPaused(false), [])

	const resetStopwatch = useCallback(() => {
		setIsActive(false)
		setIsPaused(true)
		setTime(0)
	}, [])

	useEffect(() => {
		const currStopwatchInterval = stopwatchInterval.current

		if (isActive && !isPaused) {
			stopwatchInterval.current = setInterval(
				() => setTime(time => time + interval),
				interval
			)
		} else if (currStopwatchInterval) {
			clearInterval(currStopwatchInterval)
		}

		return () => {
			if (currStopwatchInterval) clearInterval(currStopwatchInterval)
		}
	}, [interval, isActive, isPaused])

	return {
		pauseStopwatch,
		resetStopwatch,
		resumeStopwatch,
		startStopwatch,
		time
	}
}

// -----------------------------------

interface UseWindowSize {
	isMobile: boolean
	isTablet: boolean
	windowSize: WindowSize
	yPosition: number
}

const getWindowSize = () => ({
	height: window.innerHeight,
	width: window.innerWidth
})

export const useWindowSize = (onResize = noop): UseWindowSize => {
	const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize())
	const [yPosition, setYPosition] = useState(0)

	const isMobile = useMemo(
		() => windowSize.width <= Breakpoints.mobile,
		[windowSize.width]
	)
	const isTablet = useMemo(
		() => !isMobile && windowSize.width <= Breakpoints.tablet,
		[windowSize.width, isMobile]
	)

	useEffect(() => {
		const handleResize = () => {
			onResize()
			setWindowSize(getWindowSize())
		}

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [onResize])

	useEffect(() => {
		const handleYPosition = () => setYPosition(window.pageYOffset)

		window.addEventListener('scroll', handleYPosition)

		return () => window.removeEventListener('scroll', handleYPosition)
	}, [])

	return { isMobile, isTablet, windowSize, yPosition }
}

// -----------------------------------

export const useRemainingContainerHeight = (
	containerRef: RefObject<HTMLElement>,
	additionalOffset = 0
) => {
	const {
		windowSize: { height: windowHeight }
	} = useWindowSize()
	const [remainingHeight, setRemainingHeight] = useState(0)

	useEffect(() => {
		if (containerRef.current) {
			setRemainingHeight(
				windowHeight - containerRef.current.offsetTop - additionalOffset
			)
		}
	}, [additionalOffset, containerRef, windowHeight])

	return remainingHeight
}
