import cloneDeep from 'lodash/cloneDeep'
import { updateObjectValWithJSONPath } from '../generalUtils'

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
