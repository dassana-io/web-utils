import { FieldInfo, Options } from 'json2csv'

export type { FieldInfo, Options }

/**
 * More info on Distributive Conditional Types: https://stackoverflow.com/a/57103940/11279811
 */
export type DistributiveOmit<T, K extends keyof T> = T extends T
	? Omit<T, K>
	: never

// Onboarding step number enum used in web-orchestrator and web-onboarding
export enum OnboardingStepNum {
	endUserLicenseAgreement = 1,
	userName = 2,
	userWorkHours = 3,
	userPersona = 4,
	orgName = 5,
	orgManager = 6
}

export enum ModifierKeys {
	command = 'command',
	control = 'control',
	option = 'option',
	shift = 'shift'
}

export enum OperatingSystems {
	mac = 'mac',
	windows = 'windows'
}

export interface KeyMapConfig {
	key: KeyboardEvent['key']
	label: string
}
