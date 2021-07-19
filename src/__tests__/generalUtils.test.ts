import cloneDeep from 'lodash/cloneDeep'
import {
	parseParamsString,
	stringifyParamsObject,
	updateObjectValWithJSONPath
} from '../generalUtils'

const mockParamsStr = 'foo=bar&id=123&id=456'

const mockParamsObj = {
	foo: 'bar',
	id: ['123', '456']
}

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
