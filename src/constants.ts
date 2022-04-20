import { KeyMapConfig, ModifierKeys, OperatingSystems } from 'types'

export const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const MICRO_FE_CONTAINER_ID = 'micro-fe-container'

export const ONBOARDING_DEFAULT_STEP = 'onboardingDefaultStep'

export interface WindowSize {
	height: number
	width: number
}

export enum LocalStorage {
	onboarding = 'onboarding'
}

export enum Breakpoints {
	mobile = 480,
	tablet = 834,
	largeScreen = 1440
}

const getMediaSelector = (breakpoint: Breakpoints, isMax?: boolean) =>
	`@media screen and (${isMax ? 'max' : 'min'}-width: ${breakpoint}px)`

const { largeScreen, mobile, tablet } = Breakpoints

export const mediaSelectorsWithBreakpoints = {
	max: {
		[largeScreen]: getMediaSelector(largeScreen, true),
		[mobile]: getMediaSelector(mobile, true),
		[tablet]: getMediaSelector(tablet, true)
	},
	min: {
		[largeScreen]: getMediaSelector(largeScreen),
		[mobile]: getMediaSelector(mobile),
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
