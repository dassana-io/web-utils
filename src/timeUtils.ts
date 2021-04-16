import moment from 'moment-timezone'

export const convertEpochToRelativeTime = (time: number) =>
	moment(time).fromNow()

export const convertEpochToUserTimezone = (
	time?: number,
	format = 'llll z'
): string => (time ? moment(time).tz(moment.tz.guess(true)).format(format) : '')
