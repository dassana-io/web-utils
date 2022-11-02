import { api } from 'apiUtils'
import { createCtx } from 'contextUtils'
import { Services } from 'types'
import { unstable_batchedUpdates } from 'react-dom'
import {
	ConfigKey,
	ConfigObject,
	Feature,
	PREFERENCES_API,
	PREFERENCES_BY_CONFIG_KEY,
	Service
} from 'api'
import {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'

const defaultPreferencesUrl = 'https://preferences.dassana.dev'

export interface PreferencesContextProps {
	deletePreferenceByConfigKey: (configKey: ConfigKey) => Promise<void>
	preferences: ConfigObject
	refreshPreferences: () => Promise<void>
	resetPreferences: () => Promise<void>
	updatePreferences: (
		configKey: ConfigKey,
		value: ConfigObject,
		feature?: Feature
	) => Promise<void>
}

const [usePreferences, PreferencesContextProvider] =
	createCtx<PreferencesContextProps>()

interface PreferenceId {
	configKey: string
	feat: string
}

interface Props {
	children: ReactNode
	feature: Feature
	serviceMap: Service[]
}

const PreferencesProvider = ({ children, feature, serviceMap }: Props) => {
	const controller = useRef(new AbortController())
	const lastPrefCall = useRef<PreferenceId>({ configKey: '', feat: '' })

	const [preferencesLoaded, setPreferencesLoaded] = useState(false)

	const preferencesApi = useMemo(
		() =>
			api(
				serviceMap.find(
					({ serviceName }) => serviceName === Services.preferences
				)?.apiUrl || defaultPreferencesUrl
			),
		[serviceMap]
	)

	const [preferences, setPreferences] = useState<ConfigObject>({})

	const fetchPreferences = useCallback(
		async (firstLoad = false) => {
			try {
				const [featurePrefs, globalPrefs] = await Promise.all([
					fetchPreferenceByFeat(feature),
					fetchPreferenceByFeat(Services.preferences)
				])

				unstable_batchedUpdates(() => {
					if (firstLoad) setPreferencesLoaded(true)
					setPreferences({ ...featurePrefs, ...globalPrefs })
				})
			} catch (error: any) {
				console.log(error)

				if (firstLoad) setPreferencesLoaded(true)
			}
		},
		[feature, fetchPreferenceByFeat]
	)

	const resetPreferences = useCallback(async () => {
		try {
			await preferencesApi.delete(PREFERENCES_API(feature))

			await fetchPreferences()
		} catch (error: any) {
			console.log(error)
		}
	}, [feature, fetchPreferences, preferencesApi])

	const deletePreferenceByConfigKey = useCallback(
		async (configKey: ConfigKey) => {
			try {
				await preferencesApi.delete(
					PREFERENCES_BY_CONFIG_KEY(feature, configKey)
				)

				await fetchPreferences()
			} catch (error: any) {
				console.log(error)
			}
		},
		[feature, fetchPreferences, preferencesApi]
	)

	const updatePreferences = useCallback(
		async (configKey: ConfigKey, value: ConfigObject, feat = feature) => {
			const { configKey: prevConfigKey, feat: prevFeat } =
				lastPrefCall.current

			if (prevConfigKey === configKey && prevFeat === feat) {
				controller.current.abort()

				controller.current = new AbortController()
			} else {
				lastPrefCall.current.configKey = configKey
				lastPrefCall.current.feat = feat
			}

			try {
				await preferencesApi.put(
					PREFERENCES_BY_CONFIG_KEY(feat, configKey),
					value,
					{ signal: controller.current.signal }
				)

				await fetchPreferences()
			} catch (error: any) {
				if (error.code !== 'ERR_CANCELED') console.log(error)
			}
		},
		[feature, fetchPreferences, preferencesApi]
	)

	useEffect(() => {
		fetchPreferences(true)
	}, [fetchPreferences])

	return (
		<PreferencesContextProvider
			value={{
				deletePreferenceByConfigKey,
				preferences,
				refreshPreferences: fetchPreferences,
				resetPreferences,
				updatePreferences
			}}
		>
			{preferencesLoaded && children}
		</PreferencesContextProvider>
	)
}

export { usePreferences, PreferencesProvider }
