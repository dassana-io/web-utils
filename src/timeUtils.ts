import { format } from 'date-fns-tz'
import { formatDistanceToNowStrict } from 'date-fns'

export const convertEpochToRelativeTime = (time: number) =>
	formatDistanceToNowStrict(time, { addSuffix: true })

export const convertEpochToUserTimezone = (
	time?: number,
	timeFormat = 'EEE, MMM d yyyy hh:mm a z',
	timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
): string => (time ? format(time, timeFormat, { timeZone }) : '')

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
