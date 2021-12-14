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
