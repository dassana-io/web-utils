import axiosRetry from 'axios-retry'
import jsonmergepatch from 'json-merge-patch'
import pick from 'lodash/pick'
import { v4 as uuidv4 } from 'uuid'
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosRequestHeaders,
	type CancelTokenSource
} from 'axios'
import { type Emitter, ev } from './eventUtils'
import { type ErrorInfo, type InternalError } from 'api'
import ndjsonStream, { type StreamedResponse } from 'can-ndjson-stream'
import { useCallback, useRef } from 'react'

const { CancelToken } = axios

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export type ErrorTypes = ErrorInfo | InternalError
export type { AxiosInstance, AxiosRequestConfig } from 'axios'

const getHeaders = (
	additionalHeaders = {}
): AxiosRequestHeaders | HeadersInit => ({
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
			headers: getHeaders(config.headers) as AxiosRequestHeaders
		}),
		error => Promise.reject(error)
	)

	axiosRetry(apiClient)

	return apiClient
}

interface InternalEmbeddedError {
	message: string
}

export const handleAjaxErrors = (error: any, emitter: Emitter): void => {
	if (axios.isCancel(error)) return

	if (error.response) {
		const { _embedded, key, msg } = error.response.data

		let message = msg || key

		if (_embedded) {
			const { errors = [] } = _embedded

			if (errors.length) {
				message = errors
					.map(({ message }: InternalEmbeddedError) => message)
					.join(', ')
			}
		}

		return emitter.emitNotificationEvent(
			ev.error,
			message || JSON.stringify(error.response.data)
		)
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
				...(getHeaders(additionalConfig.headers) as HeadersInit)
			},
			method
		})

		if (response && response.status >= 200 && response.status <= 299) {
			const jsonStreamReader = ndjsonStream<T>(response.body).getReader()

			let result: StreamedResponse<T> | undefined

			onPreStreamCb && onPreStreamCb()

			while (!result || !result.done) {
				result = await jsonStreamReader.read()

				if (result) {
					onNewStreamResponse(result.value)
				}
			}
		} else {
			handleErrors && handleErrors(response)
		}
	} catch (error: any) {
		handleErrors && handleErrors(error)
	}
}

interface PatchInfo<T, U> {
	fieldValues: U
	initialValues: T
}

export const generatePatch = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>
>({
	initialValues,
	fieldValues
}: PatchInfo<T, U>): U =>
	(jsonmergepatch.generate(
		pick(initialValues, Object.keys(fieldValues)),
		fieldValues
	) ?? {}) as U

export const useCancelRequest = () => {
	const cancelTokenRef = useRef<CancelTokenSource>(CancelToken.source())

	const cancelPreviousRequest = useCallback(() => {
		cancelTokenRef.current.cancel('Request canceled')

		cancelTokenRef.current = CancelToken.source()
	}, [])

	const getCancelToken = useCallback(() => cancelTokenRef.current.token, [])

	return {
		cancelPreviousRequest,
		getCancelToken
	}
}
