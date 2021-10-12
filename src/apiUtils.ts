import axiosRetry from 'axios-retry'
import jsonmergepatch from 'json-merge-patch'
import pick from 'lodash/pick'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Emitter, ev } from './eventUtils'
import { ErrorInfo, InternalError } from 'api'

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export type ErrorTypes = ErrorInfo | InternalError
export type { AxiosInstance, AxiosRequestConfig } from 'axios'

export const api: (apiUrl?: string) => AxiosInstance = (apiUrl = '') => {
	const axiosRequestConfig: AxiosRequestConfig = {
		headers: {
			Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
			[DASSANA_REQUEST_ID]: uuidv4()
		}
	}

	if (apiUrl) {
		axiosRequestConfig.baseURL = apiUrl
	}

	const apiClient = axios.create(axiosRequestConfig)

	axiosRetry(apiClient)

	return apiClient
}

export const handleAjaxErrors = (
	error: AxiosError<ErrorTypes>,
	emitter: Emitter
): void => {
	if (axios.isCancel(error)) return

	if (error.response) {
		const { key = 'Something went wrong', msg } = error.response.data

		return emitter.emitNotificationEvent(ev.error, msg ? msg : key)
	} else {
		return emitter.emitNotificationEvent(ev.error, error.message)
	}
}

interface PatchInfo<T, U> {
	fieldValues: U
	initialValues: T
}

export const generatePatch = <T extends {}, U>({
	initialValues,
	fieldValues
}: PatchInfo<T, U>): U =>
	(jsonmergepatch.generate(
		pick(initialValues, Object.keys(fieldValues)),
		fieldValues
	) || {}) as U
