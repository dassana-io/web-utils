import { initializeLocalStorageMock } from '../testUtils'
import { omit } from 'lodash'
import { api, DASSANA_REQUEST_ID, generatePatch, TOKEN } from '../apiUtils'
import axios, { AxiosStatic } from 'axios'

jest.mock('axios', () => {
	const mockAxios = jest.genMockFromModule<AxiosStatic>('axios') as any

	mockAxios.create = jest.fn(() => mockAxios)

	return mockAxios
})
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('uuid', () => ({
	v4: () => 'abc'
}))

const mockEndpoint = 'endpoint'
const mockRequestData = { bar: 'baz' }
const mockToken = 'fakeToken'

initializeLocalStorageMock()

describe('api', () => {
	describe('get', () => {
		beforeEach(async () => {
			localStorage.setItem(TOKEN, mockToken)
			mockedAxios.get.mockImplementationOnce(() =>
				Promise.resolve({ data: { foo: 'bar' } })
			)

			await api().get(mockEndpoint)
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('should calls axios.create with the correct headers', () => {
			expect(mockedAxios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: `Bearer ${mockToken}`,
						[DASSANA_REQUEST_ID]: 'abc'
					})
				})
			)
		})

		it('should call axios.get with the correct endpoint', () => {
			expect(mockedAxios.get).toHaveBeenCalledWith(mockEndpoint)
		})
	})

	describe('patch', () => {
		it('should call axios.patch with the correct endpoint and pass the correct data', async () => {
			mockedAxios.patch.mockImplementationOnce(() =>
				Promise.resolve({ data: { foo: 'bar' } })
			)

			await api().patch(mockEndpoint, mockRequestData)

			expect(mockedAxios.patch).toHaveBeenCalledWith(
				mockEndpoint,
				mockRequestData
			)
		})
	})

	describe('post', () => {
		it('should call axios.post with the correct endpoint and pass the correct data', async () => {
			mockedAxios.post.mockImplementationOnce(() =>
				Promise.resolve({ data: { foo: 'bar' } })
			)

			await api().post('endpoint', mockRequestData)

			expect(mockedAxios.post).toHaveBeenCalledWith(
				'endpoint',
				mockRequestData
			)
		})
	})
})

describe('generatePatch', () => {
	interface MockUser {
		firstName: string
		id: string
		lastName?: string
	}

	type MockUserInfo = Omit<MockUser, 'id'>

	const mockInitialValues = {
		firstName: 'Lorem',
		id: 'abc-1234',
		lastName: 'Ipsum'
	} as MockUser

	const mockFieldValues = {
		firstName: 'Foo',
		lastName: 'Ipsum'
	} as MockUserInfo

	it('should return a patch object when values are changed', () => {
		const generatedPatch = generatePatch<MockUser, MockUserInfo>({
			fieldValues: mockFieldValues,
			initialValues: mockInitialValues,
			keysToOmitFromPatch: 'id'
		})

		expect(generatedPatch).toEqual({ firstName: 'Foo' })
	})

	it('should return an empty object if no changes are detected', () => {
		const generatedPatch = generatePatch<MockUser, MockUserInfo>({
			fieldValues: omit(mockInitialValues, 'id'),
			initialValues: mockInitialValues,
			keysToOmitFromPatch: 'id'
		})

		expect(generatedPatch).toEqual({})
	})

	it('use initial values as is if there are no keys to be omitted', () => {
		const generatedPatch = generatePatch<MockUser, MockUserInfo>({
			fieldValues: mockFieldValues,
			initialValues: mockInitialValues
		})

		expect(generatedPatch).toEqual({ firstName: 'Foo', id: null })
	})
})
