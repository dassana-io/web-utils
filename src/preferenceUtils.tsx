import { api } from 'apiUtils'
import { createCtx } from 'contextUtils'
import { Services } from 'types'
import {
	ConfigKey,
	ConfigObject,
	Feature,
	PREFERENCES_API,
	PREFERENCES_BY_CONFIG_KEY,
	Service
} from 'api'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

const defaultPreferencesUrl = 'https://preferences.dassana.dev'

export interface PreferencesContextProps {
	deletePreferenceByConfigKey: (configKey: ConfigKey) => void
	preferences: ConfigObject
	resetPreferences: () => void
	updatePreferences: (
		configKey: ConfigKey,
		value: ConfigObject,
		feature?: Feature
	) => void
}

const [usePreferences, PreferencesContextProvider] =
	createCtx<PreferencesContextProps>()

interface Props {
	children: ReactNode
	feature: Feature
	serviceMap: Service[]
}

const PreferencesProvider = ({ children, feature, serviceMap }: Props) => {
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

	const fetchPreferences = useCallback(async () => {
		try {
			const { data } = await preferencesApi.get<ConfigObject>(
				PREFERENCES_API(feature)
			)

			setPreferences(data)
		} catch (error: any) {
			console.log(error)
		}
	}, [feature, preferencesApi])

	const resetPreferences = useCallback(async () => {
		try {
			await preferencesApi.delete(PREFERENCES_API(feature))

			fetchPreferences()
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

				fetchPreferences()
			} catch (error: any) {
				console.log(error)
			}
		},
		[feature, fetchPreferences, preferencesApi]
	)

	const updatePreferences = useCallback(
		async (configKey: ConfigKey, value: ConfigObject, feat = feature) => {
			try {
				await preferencesApi.put(
					PREFERENCES_BY_CONFIG_KEY(feat, configKey),
					value
				)

				fetchPreferences()
			} catch (error: any) {
				console.log(error)
			}
		},
		[feature, fetchPreferences, preferencesApi]
	)

	useEffect(() => {
		fetchPreferences()
	}, [fetchPreferences])

	return (
		<PreferencesContextProvider
			value={{
				deletePreferenceByConfigKey,
				preferences,
				resetPreferences,
				updatePreferences
			}}
		>
			{children}
		</PreferencesContextProvider>
	)
}

export { usePreferences, PreferencesProvider }
