import cloneDeep from 'lodash/cloneDeep'
import {
	buildBrowserUrl,
	convertJSONToCsv,
	convertJSONToString,
	parseParamsString,
	stringifyParamsObject,
	updateObjectValWithJSONPath
} from '../generalUtils'

const mockParamsStr = 'foo=bar&id=123&id=456'
const mockOrigin = 'https://console.dassana.cloud'
const mockPathname = 'alerts'
const mockHash = {
	bar: 'baz'
}
const mockSearch = {
	foo: 'bar'
}

const mockBrowserLocation = {
	origin: mockOrigin,
	pathname: mockPathname,
	search: '?view=manage&alertId=P-1234&cloud-type=aws&cloud-type=azure'
}

interface MockParams {
	foo: string
	id: string[]
}

const mockParamsObj = {
	foo: 'bar',
	id: ['123', '456']
}

describe('convertJSONToCsv', () => {
	it('should return a csv string', () => {
		const csvStr = convertJSONToCsv<MockParams>(mockParamsObj)

		expect(typeof csvStr).toBe('string')
		expect(csvStr).toBe('"foo","id"\n"bar","[""123"",""456""]"')
	})
})

describe('convertJSONToString', () => {
	it('should return a properly formatted JSON string', () => {
		const jsonStr = convertJSONToString(mockParamsObj)

		expect(jsonStr).toMatch(JSON.stringify(mockParamsObj, null, 2))
	})
})

describe('parseParamsString', () => {
	it('should return a params object', () => {
		const paramsObj = parseParamsString(`?${mockParamsStr}`)

		expect(paramsObj).toMatchObject(mockParamsObj)
	})
})

describe('stringifyParamsObject', () => {
	it('should return stringified params', () => {
		const paramsStr = stringifyParamsObject(mockParamsObj)

		expect(paramsStr).toMatch(mockParamsStr)
	})
})

describe('buildBrowserUrl', () => {
	Object.defineProperty(window, 'location', {
		get() {
			return mockBrowserLocation
		}
	})

	it('should return properly formatted browserUrl', () => {
		const newPath = 'query'

		const url = buildBrowserUrl({
			hash: mockHash,
			pathname: newPath,
			search: mockSearch
		})

		expect(url).toBe(
			`/${newPath}?${stringifyParamsObject(
				mockSearch
			)}#${stringifyParamsObject(mockHash)}`
		)
	})

	it('should return url with new pathname if one is passed in', () => {
		const newPath = 'query'

		const url = buildBrowserUrl({
			pathname: newPath
		})

		expect(url).toContain(newPath)
	})

	it('should return url with the original pathname if one is not passed in', () => {
		const url = buildBrowserUrl({})

		expect(url).toContain(mockPathname)
	})

	it('should not use original pathname if pathname is empty string', () => {
		const url = buildBrowserUrl({
			options: {
				includeOrigin: true
			},
			pathname: ''
		})

		expect(url).toBe(`${mockOrigin}/`)
	})

	it('should return url with the origin if includeOrigin is passed as true in options', () => {
		const newPath = 'query'

		const url = buildBrowserUrl({
			options: {
				includeOrigin: true
			},
			pathname: newPath
		})

		expect(url).toBe(`${mockOrigin}/${newPath}`)
	})

	it('should return url with new search if one is passed in', () => {
		const url = buildBrowserUrl({
			search: mockSearch
		})

		expect(url).toContain(`?${stringifyParamsObject(mockSearch)}`)
	})

	it('should return url with new hash if one is passed in', () => {
		const url = buildBrowserUrl({
			hash: mockHash
		})

		expect(url).toContain(`#${stringifyParamsObject(mockHash)}`)
	})
})

describe('updateObjectValWithJSONPath', () => {
	const mockObject = {
		baz: {
			lorem: 'ipsum'
		},
		foo: 'bar'
	}

	let clonedObject: Record<string, any>

	beforeEach(() => {
		clonedObject = cloneDeep(mockObject)
	})

	it('should correctly update the object if given a valid JSONPath', () => {
		expect(clonedObject.baz.lorem).toEqual('ipsum')

		updateObjectValWithJSONPath(clonedObject, '$.baz.lorem', 'mockValue')

		expect(clonedObject.baz.lorem).toEqual('mockValue')
	})

	it('should not update the object if given an invalid JSONPath', () => {
		expect(clonedObject).toEqual(mockObject)

		updateObjectValWithJSONPath(clonedObject, '$.baz.lore', 'mockValue')

		expect(clonedObject).toEqual(mockObject)
	})
})
