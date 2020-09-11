import axiosRetry from 'axios-retry'
import jsonmergepatch from 'json-merge-patch'
import omit from 'lodash/omit'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Emitter, ev } from './eventUtils'
import { ErrorInfo, InternalError } from 'api'

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export type DassanaError = ErrorInfo | InternalError
export type DassanaAxiosInstance = AxiosInstance

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
	{ response }: AxiosError<DassanaError>,
	emitter: Emitter
): void => {
	if (response) {
		const { key, msg } = response.data

		return emitter.emitNotificationEvent(ev.error, msg ? msg : key)
	}
}

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
