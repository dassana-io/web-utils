import {
	convertEpochToRelativeTime,
	convertEpochToUserTimezone
} from '../timeUtils'

Date.now = jest.fn(() => 1605380520000)

describe('convertEpochToRelativeTime', () => {
	it('should convert epoch to relative time', () => {
		const time = convertEpochToRelativeTime(1602698523200)

		expect(time).toMatch('1 month ago')
	})
})

describe('convertEpochToUserTimezone', () => {
	it('should convert epoch to a human friendly date in the correct timezone', () => {
		const time = convertEpochToUserTimezone(
			1602698523200,
			undefined,
			'America/Los_Angeles'
		)

		expect(time).toMatch('Wed, Oct 14 2020 11:02 AM PDT')
	})

	it('should return an empty string if no time is passed in', () => {
		const time = convertEpochToUserTimezone()

		expect(time).toBe('')
	})
})
