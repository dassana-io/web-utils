import { formatInTimeZone } from 'date-fns-tz'
import he from 'he'
import sortBy from 'lodash/sortBy'
import { TimezoneV2 } from 'api/profile'
import { formatDistanceToNowStrict, sub } from 'date-fns'

export const convertEpochToRelativeTime = (time: number) =>
	formatDistanceToNowStrict(time, { addSuffix: true })

export const convertEpochToUserTimezone = (
	time?: number,
	timeFormat = 'EEE, MMM d yyyy hh:mm a z',
	timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
): string => (time ? formatInTimeZone(time, timeZone, timeFormat) : '')

const filterOutExtraTimezones = ({ id }: TimezoneV2) =>
	id && !id.startsWith('Etc/')

/**
 * The `getTimezoneOffset()` method returns the difference, in minutes,
 * between a date as evaluated in the UTC time zone, and the same date
 * as evaluated in the local time zone.
 *
 *     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
 */
export const guessUserTimezoneOffset = () =>
	-(new Date().getTimezoneOffset() / 60)

export const guessUserTimezone = (): string =>
	Intl.DateTimeFormat().resolvedOptions().timeZone

export interface TimezoneOption {
	offset: number
	text: string
	value: string
}

const mapTimezoneOptions = ({ id = '', utcOffset }: TimezoneV2) => {
	const offset = !utcOffset || utcOffset === 'Z' ? '±00:00' : utcOffset

	const parseOffset = (offset: string): number => {
		const value = offset.replace('±', '').replace(':', '.')

		return parseFloat(value)
	}

	const display = `(UTC${offset}) ${id}`

	return {
		offset: parseOffset(offset),
		text: he.decode(display),
		value: id
	}
}

export const sortTimezones = (
	timezones: TimezoneV2[],
	factor: string
): TimezoneOption[] =>
	sortBy(
		timezones.filter(filterOutExtraTimezones).map(mapTimezoneOptions),
		factor
	)

export const subtractDurationFromDate = (
	date: Date | number,
	duration: Duration
) => sub(date, duration)
