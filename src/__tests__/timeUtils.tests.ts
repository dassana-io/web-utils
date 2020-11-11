import { convertEpochToUserTimezone } from '../timeUtils'

jest.mock('moment-timezone', () => {
	const moment = jest.requireActual('moment-timezone')
	// To prevent tests failing for future remote teams
	moment.tz.setDefault('America/Los_Angeles')
	moment.tz.guess = () => 'America/Los_Angeles'

	return moment
})

describe('convertEpochToUserTimezone', () => {
	it('should convert epoch to a human friendly date in the correct timezone', () => {
		const time = convertEpochToUserTimezone(1602698523200)

		expect(time).toMatch('Wed, Oct 14, 2020 11:02 AM PDT')
	})

	it('should return an empty string if no time is passed in', () => {
		const time = convertEpochToUserTimezone()

		expect(time).toBe('')
	})
})
