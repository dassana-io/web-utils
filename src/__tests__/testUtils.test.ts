import { initializeLocalStorageMock } from '../testUtils'

initializeLocalStorageMock()

describe('initializeLocalStorageMock', () => {
	beforeEach(() => {
		localStorage.setItem('foo', 'bar')
		localStorage.setItem('key', 'value')
	})

	afterEach(() => {
		localStorage.clear()
	})

	describe('getItem', () => {
		it('correctly retrieves item from storage if key exists', () => {
			expect(localStorage.getItem('foo')).toEqual('bar')
		})

		it('returns null if key does not exist', () => {
			expect(localStorage.getItem('fake')).toEqual(null)
		})
	})

	describe('setItem', () => {
		it('correctly stores item', () => {
			localStorage.setItem('hello', 'world')

			expect(localStorage.getItem('hello')).toEqual('world')
		})

		it('will not store entry if value is passed as empty string', () => {
			localStorage.setItem('hello', '')

			expect(localStorage.getItem('hello')).toEqual(null)
		})
	})

	it('correctly returns number of items in storage', () => {
		expect(localStorage.length).toEqual(2)

		localStorage.setItem('hello', 'world')

		expect(localStorage.length).toEqual(3)
	})

	it('removeItem successfully deletes entry from storage', () => {
		expect(localStorage.getItem('foo')).toEqual('bar')

		localStorage.removeItem('foo')

		expect(localStorage.getItem('foo')).toEqual(null)
	})

	it('will remove all storage entries when cleared', () => {
		expect(localStorage.length).toEqual(2)

		localStorage.clear()

		expect(localStorage.length).toEqual(0)
	})

	it('will return the key at the index passed if it exists', () => {
		expect(localStorage.key(0)).toEqual('foo')
		expect(localStorage.key(3)).toEqual(null)
	})
})
