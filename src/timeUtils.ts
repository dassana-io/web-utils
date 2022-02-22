import { format } from 'date-fns-tz'
import { formatDistanceToNowStrict } from 'date-fns'

export const convertEpochToRelativeTime = (time: number) =>
	formatDistanceToNowStrict(time, { addSuffix: true })

export const convertEpochToUserTimezone = (
	time?: number,
	timeFormat = 'EEE, MMM d yyyy hh:mm a z',
	timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
): string => (time ? format(time, timeFormat, { timeZone }) : '')
