import intersection from 'lodash/intersection'
import isUndefined from 'lodash/isUndefined'
import pluralize from 'pluralize'
import bytes, { BytesOptions } from 'bytes'
import { JSONPath, JSONPathOptions } from 'jsonpath-plus'
import { Options, parse } from 'json2csv'
import queryString, { ParseOptions, StringifyOptions } from 'query-string'
import { RefObject, useEffect, useRef, useState } from 'react'

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
	const env = host.includes('localhost') ? 'dev' : host.split('.').pop()

	return env
}

export const parseParamsString = (str: string, options: ParseOptions = {}) =>
	queryString.parse(str, options)

export const removeFromArrByIdx = <T>(arr: T[], index: number) => [
	...arr.slice(0, index),
	...arr.slice(index + 1)
]

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
	newHash?: string
) => {
	const { hash, origin, pathname } = window.location

	if (newHash && newHash.charAt(0) !== '#') newHash = `#${newHash}`

	const newUrl = `${origin}${pathname}?${stringifyParamsObject(newParams)}${
		!isUndefined(newHash) ? newHash : hash
	}`

	window.history.pushState(null, '', newUrl)
}

interface BrowserUrlOptions {
	includeOrigin?: boolean
}

interface BrowserUrl {
	pathname?: string
	search?: Record<string, any>
	hash?: Record<string, any>
	options?: BrowserUrlOptions
}

export const buildBrowserUrl = ({
	hash,
	search,
	options = {},
	pathname
}: BrowserUrl) => {
	const { origin, pathname: originalPathname } = window.location
	const { includeOrigin = false } = options

	let composedUrl = includeOrigin ? origin : ''

	composedUrl = `${composedUrl}/${
		isUndefined(pathname) ? originalPathname : pathname
	}`

	if (search) {
		composedUrl += `?${stringifyParamsObject(search)}`
	}

	if (hash) {
		composedUrl += `#${stringifyParamsObject(hash)}`
	}

	return composedUrl
}

export const pluralizeWord = (
	word: string,
	count?: number,
	showCount = false
) => pluralize(word, count, showCount)

export const useHoverState = <T extends HTMLElement>(): [
	RefObject<T>,
	boolean
] => {
	const [value, setValue] = useState<boolean>(false)
	const ref = useRef<T>(null)

	const handleMouseOver = (): void => setValue(true)
	const handleMouseOut = (): void => setValue(false)

	useEffect(() => {
		const node = ref.current

		if (ref && node) {
			node.addEventListener('mouseenter', handleMouseOver)
			node.addEventListener('mouseleave', handleMouseOut)

			return () => {
				node.removeEventListener('mouseenter', handleMouseOver)
				node.removeEventListener('mouseleave', handleMouseOut)
			}
		}
	}, [ref.current]) // eslint-disable-line react-hooks/exhaustive-deps

	return [ref, value]
}

export const formatCurrency = (
	amount: number,
	locale = 'en-US',
	options = { currency: 'USD', style: 'currency' }
) => {
	const formatter = new Intl.NumberFormat(locale, options)

	return formatter.format(amount)
}

export const formatBytes = (value: number, options?: BytesOptions) =>
	bytes(value, options)

export const abbreviateNumber = (value: number) =>
	Intl.NumberFormat('en-US', {
		maximumFractionDigits: 1,
		notation: 'compact'
	}).format(value)

export const prettifyNumber = (value: number): string =>
	value.toLocaleString('en-US')

export const processURLSearchParams = (params: URLSearchParams) => {
	const processedParams: Record<string, string[]> = {}

	for (const [key, value] of params) {
		if (processedParams[key]) {
			processedParams[key].push(value)
		} else {
			processedParams[key] = [value]
		}
	}

	return processedParams
}

export const findCommonItemsInArrays = <T>(arr1: T[], arr2: T[]) =>
	intersection(arr1, arr2)

export const allItemsInFirstArrExistInSecondArr = <T>(arr1: T[], arr2: T[]) =>
	findCommonItemsInArrays(arr1, arr2).length === arr1.length

export const removeItemsFromArray = <T>(
	arr: T[],
	itemsToRemove: T | T[]
): T[] =>
	arr.filter(item =>
		Array.isArray(itemsToRemove)
			? !itemsToRemove.includes(item)
			: item !== itemsToRemove
	)
