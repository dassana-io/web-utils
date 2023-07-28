import { type ConfigKey, type Feature } from './preferences'

export * from './global'
export * from './serviceMap'
export type { ConfigKey, ConfigObject, Feature } from './preferences'

export const PREFERENCES_API = (feature: Feature) => `user/config/${feature}`
export const PREFERENCES_BY_CONFIG_KEY = (
	feature: Feature,
	configKey: ConfigKey
) => `${PREFERENCES_API(feature)}/${configKey}`
