import { JSONPath, JSONPathOptions } from 'jsonpath-plus'
import queryString, { ParseOptions, StringifyOptions } from 'query-string'

interface CopyToClipboard {
	(str: string, callback?: () => void): void
}

export const copyToClipboard: CopyToClipboard = (str, callback) =>
	window.navigator.clipboard.writeText(str).then(callback)

export const parseParamsString = (str: string, options: ParseOptions = {}) =>
	queryString.parse(str, options)

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
