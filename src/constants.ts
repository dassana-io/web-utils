import endsWith from 'lodash/endsWith'
import has from 'lodash/has'
import startCase from 'lodash/startCase'
import { type KeyMapConfig, ModifierKeys, OperatingSystems } from 'types'

/* https://stackoverflow.com/a/67535345 */
export const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const MICRO_FE_CONTAINER_ID = 'micro-fe-container'

export const ONBOARDING_DEFAULT_STEP = 'onboardingDefaultStep'

export interface WindowSize {
	height: number
	width: number
}

export enum LocalStorage {
	lastVisitedCustomDashboard = 'lastVisitedCustomDashboard',
	onboarding = 'onboarding'
}

export enum Breakpoints {
	mobile = 480,
	tablet = 834,
	smallScreen = 1440,
	mediumScreen = 1512,
	largeScreen = 1728
}

const getMediaSelector = (breakpoint: Breakpoints, isMax?: boolean) =>
	`@media screen and (${isMax ? 'max' : 'min'}-width: ${breakpoint}px)`

const { largeScreen, mediumScreen, mobile, smallScreen, tablet } = Breakpoints

export const mediaSelectorsWithBreakpoints = {
	max: {
		[largeScreen]: getMediaSelector(largeScreen, true),
		[mediumScreen]: getMediaSelector(mediumScreen, true),
		[mobile]: getMediaSelector(mobile, true),
		[smallScreen]: getMediaSelector(smallScreen, true),
		[tablet]: getMediaSelector(tablet, true)
	},
	min: {
		[largeScreen]: getMediaSelector(largeScreen),
		[mediumScreen]: getMediaSelector(mediumScreen),
		[mobile]: getMediaSelector(mobile),
		[smallScreen]: getMediaSelector(smallScreen),
		[tablet]: getMediaSelector(tablet)
	}
}

export const modifierKeysMap: Record<
	string,
	Record<OperatingSystems, KeyMapConfig>
> = {
	[ModifierKeys.command]: {
		[OperatingSystems.mac]: {
			key: 'Meta',
			label: '⌘'
		},
		[OperatingSystems.windows]: {
			key: 'Control',
			label: 'Ctrl'
		}
	},
	[ModifierKeys.control]: {
		[OperatingSystems.mac]: {
			key: 'Control',
			label: '^'
		},
		[OperatingSystems.windows]: {
			key: 'Control',
			label: 'Ctrl'
		}
	},
	[ModifierKeys.option]: {
		[OperatingSystems.mac]: {
			key: 'Alt',
			label: '⌥'
		},
		[OperatingSystems.windows]: {
			key: 'Alt',
			label: 'Alt'
		}
	},
	[ModifierKeys.shift]: {
		[OperatingSystems.mac]: {
			key: 'Shift',
			label: '⇧'
		},
		[OperatingSystems.windows]: {
			key: 'Shift',
			label: 'Shift'
		}
	}
}

const filterKeyMap: Record<string, string> = {
	criticality_severity: 'Criticality - Severity',
	isCveExploitable: 'Is CVE Exploitable',
	isCveInCisaKev: 'CISA KEV',
	isCveTrending: 'Is CVE Trending',
	isInternetExposed: 'Internet Reachability',
	isReachable: 'Code Reachability',
	isSlaBreached: 'Is SLA Breached'
}

export const getFilterKeyLabel = (key: string): string => {
	const processedKey = key.replace(/[^a-zA-Z ]/g, '')

	if (has(filterKeyMap, processedKey)) return filterKeyMap[processedKey]

	return startCase(
		endsWith(key, 'Id') ? processedKey.replace(/Id/i, 'ID') : processedKey
	)
}
