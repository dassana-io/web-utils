import axiosRetry from 'axios-retry'
import jsonmergepatch from 'json-merge-patch'
import pick from 'lodash/pick'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Emitter, ev } from './eventUtils'
import { ErrorInfo, InternalError } from 'api'
import ndjsonStream, { StreamedResponse } from 'can-ndjson-stream'

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export type ErrorTypes = ErrorInfo | InternalError
export type { AxiosInstance, AxiosRequestConfig } from 'axios'

const getHeaders = (additionalHeaders = {}): AxiosRequestConfig['headers'] => ({
	...additionalHeaders,
	Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
	[DASSANA_REQUEST_ID]: uuidv4()
})

export const api: (apiUrl?: string) => AxiosInstance = (apiUrl = '') => {
	const axiosRequestConfig: AxiosRequestConfig = {}

	if (apiUrl) {
		axiosRequestConfig.baseURL = apiUrl
	}

	const apiClient = axios.create(axiosRequestConfig)

	apiClient.interceptors.request.use(
		config => ({
			...config,
			headers: getHeaders(config.headers)
		}),
		error => Promise.reject(error)
	)

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

interface NdJsonStreamConfig<T> {
	additionalConfig?: Omit<RequestInit, 'body' | 'method'>
	data?: Record<string, any>
	endpoint: string
	handleErrors?: (error: any) => void
	method: AxiosRequestConfig['method']
	onNewStreamResponse: (result: StreamedResponse<T>['value']) => void
	onPreStreamCb?: () => void
}

export const initNdJsonStream = async <T>({
	additionalConfig = {},
	data = {},
	endpoint,
	handleErrors,
	method,
	onNewStreamResponse,
	onPreStreamCb
}: NdJsonStreamConfig<T>) => {
	try {
		const response = await fetch(endpoint, {
			...additionalConfig,
			body: JSON.stringify(data),
			headers: {
				Accept: 'application/x-ndjson',
				'Content-type': 'application/json',
				...getHeaders(additionalConfig.headers)
			},
			method
		})

		const jsonStreamReader = ndjsonStream<T>(response.body).getReader()

		let result: StreamedResponse<T> | undefined

		onPreStreamCb && onPreStreamCb()

		while (!result || !result.done) {
			result = await jsonStreamReader.read()

			if (result) {
				onNewStreamResponse(result.value)
			}
		}
	} catch (error: any) {
		handleErrors && handleErrors(error)
	}
}

interface PatchInfo<T, U> {
	fieldValues: U
	initialValues: T
}

export const generatePatch = <T extends {}, U extends {}>({
	initialValues,
	fieldValues
}: PatchInfo<T, U>): U =>
	(jsonmergepatch.generate(
		pick(initialValues, Object.keys(fieldValues)) as unknown as ValidJson,
		fieldValues
	) || {}) as U
