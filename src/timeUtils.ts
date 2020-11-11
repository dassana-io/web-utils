import moment from 'moment-timezone'

export const convertEpochToUserTimezone = (
	time?: number,
	format = 'llll'
): string => (time ? moment(time).tz(moment.tz.guess(true)).format(format) : '')
