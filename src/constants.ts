export const ONBOARDING_DEFAULT_STEP = 'onboardingDefaultStep'

export interface WindowSize {
	height: number
	width: number
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
