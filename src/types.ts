/**
 * More info on Distributive Conditional Types: https://stackoverflow.com/a/57103940/11279811
 */
export type DistributiveOmit<T, K extends keyof T> = T extends T
	? Omit<T, K>
	: never

// Onboarding step number enum used in web-orchestrator and web-onboarding
export enum OnboardingStepNum {
	userName = 1,
	userWorkHours = 2,
	userPersona = 3,
	orgName = 4,
	orgManager = 5
}
