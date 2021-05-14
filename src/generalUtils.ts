import { JSONPath, JSONPathOptions } from 'jsonpath-plus'

interface CopyToClipboard {
	(str: string, callback?: () => void): void
}
export const copyToClipboard: CopyToClipboard = (str, callback) =>
	window.navigator.clipboard.writeText(str).then(callback)

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
