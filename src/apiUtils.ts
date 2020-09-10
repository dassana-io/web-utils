import axiosRetry from 'axios-retry'
import { ErrorInfo } from 'api'
import jsonmergepatch from 'json-merge-patch'
import omit from 'lodash/omit'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosInstance } from 'axios'
import { Emitter, ev } from 'eventUtils'

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export const api: () => AxiosInstance = () => {
	const apiClient = axios.create({
		headers: {
			Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
			[DASSANA_REQUEST_ID]: uuidv4()
		}
	})
	axiosRetry(apiClient)

	return apiClient
}

export const handleAjaxErrors = (
	{ key, msg }: ErrorInfo,
	emitter: Emitter
): void => emitter.emitNotificationEvent(ev.error, msg ? msg : key)

interface PatchInfo<T, U> {
	fieldValues: U
	initialValues: T
	keysToOmitFromPatch?: string | string[]
}

export const generatePatch = <T extends {}, U>({
	initialValues,
	fieldValues,
	keysToOmitFromPatch = []
}: PatchInfo<T, U>): U =>
	(jsonmergepatch.generate(
		omit(initialValues, keysToOmitFromPatch),
		fieldValues
	) || {}) as U
