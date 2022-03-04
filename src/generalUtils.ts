import { JSONPath, JSONPathOptions } from 'jsonpath-plus'
import { Options, parse } from 'json2csv'
import queryString, { ParseOptions, StringifyOptions } from 'query-string'

export const convertJSONToCsv = <T>(json: T[] | T, options?: Options<T>) =>
	parse<T>(json, options)

export const convertJSONToString = (json: Record<string, any>) =>
	JSON.stringify(json, null, 2)

interface CopyToClipboard {
	(str: string, callback?: () => void): void
}

export const copyToClipboard: CopyToClipboard = (str, callback) =>
	window.navigator.clipboard.writeText(str).then(callback)

interface DownloadBlob {
	(blob: Blob, filename: string, callback?: () => void): void
}
export const downloadBlob: DownloadBlob = (blob, filename, callback) => {
	const element = document.createElement('a')

	element.href = URL.createObjectURL(blob)
	element.download = filename

	document.body.appendChild(element)

	element.click()

	document.body.removeChild(element)

	if (callback) callback()
}

export const getAppEnv = () => {
	const host = window.location.host
	const env = host.includes('localhost') ? 'dev' : host.split('.').pop

	return env
}

export const parseParamsString = (str: string, options: ParseOptions = {}) =>
	queryString.parse(str, options)

export const sleep = async (ms: number) =>
	await new Promise(resolve => setTimeout(resolve, ms))

export const stringifyParamsObject = (
	params: Record<string, any>,
	options: StringifyOptions = {}
) => queryString.stringify(params, options)

export const updateObjectValWithJSONPath = <T>(
	json: JSONPathOptions['json'],
	key: string,
	val: T
) => {
	JSONPath({
		callback: (_payload, _value, obj) => {
			obj.parent[obj.parentProperty] = val
		},
		json,
		path: `$.${key}`
	})
}

export const updateSearchParamsInUrl = (
	newParams: Record<string, string[]>,
	newHash = ''
) => {
	const { hash, origin, pathname } = window.location

	if (newHash && newHash.charAt(0) !== '#') newHash = `#${newHash}`

	const newUrl = `${origin}${pathname}?${stringifyParamsObject(newParams)}${
		newHash ? newHash : hash
	}`

	window.history.pushState(null, '', newUrl)
}
