import axiosRetry from 'axios-retry'
import { ev } from '../eventUtils'
import { initializeLocalStorageMock } from '../testUtils'
import {
	api,
	DASSANA_REQUEST_ID,
	ErrorTypes,
	generatePatch,
	handleAjaxErrors,
	TOKEN
} from '../apiUtils'
import axios, { AxiosStatic } from 'axios'

jest.mock('axios', () => {
	const mockAxios = jest.genMockFromModule<AxiosStatic>('axios') as any

	mockAxios.create = jest.fn(() => mockAxios)

	return mockAxios
})
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('axios-retry')
jest.mock('uuid', () => ({
	v4: () => 'abc'
}))

const mockBaseUrl = 'baseUrl'
const mockEndpoint = 'endpoint'
const mockRequestData = { bar: 'baz' }
const mockToken = 'fakeToken'

interface MockErrorResponse {
	response: {
		data: ErrorTypes
	}
}

initializeLocalStorageMock()

describe('api', () => {
	beforeEach(async () => {
		localStorage.setItem(TOKEN, mockToken)
		mockedAxios.get.mockImplementationOnce(() =>
			Promise.resolve({ data: { foo: 'bar' } })
		)

		await api(mockBaseUrl).get(mockEndpoint)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should call axios.create with a baseURL if one is provided', () => {
		expect(mockedAxios.create).toHaveBeenCalledWith(
			expect.objectContaining({
				baseURL: mockBaseUrl
			})
		)
	})

	it('should call axios.create without a baseURL by default', async () => {
		jest.clearAllMocks()

		mockedAxios.get.mockImplementationOnce(() =>
			Promise.resolve({ data: { foo: 'bar' } })
		)

		await api().get(mockEndpoint)

		expect(mockedAxios.create).not.toHaveBeenCalledWith(
			expect.objectContaining({
				baseURL: expect.anything()
			})
		)
	})

	it('should call axios.create with the correct headers', () => {
		expect(mockedAxios.create).toHaveBeenCalledWith(
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: `Bearer ${mockToken}`,
					[DASSANA_REQUEST_ID]: 'abc'
				})
			})
		)
	})

	it('should call axios-retry', () => {
		expect(axiosRetry).toHaveBeenCalledTimes(1)
	})

	describe('get', () => {
		it('should call axios.get with the correct endpoint', () => {
			expect(mockedAxios.get).toHaveBeenCalledWith(mockEndpoint)
		})
	})

	describe('put', () => {
		it('should call axios.put with the correct endpoint and pass the correct data', async () => {
			mockedAxios.put.mockImplementationOnce(() =>
				Promise.resolve({ data: { foo: 'bar' } })
			)

			await api().put(mockEndpoint, mockRequestData)

			expect(mockedAxios.put).toHaveBeenCalledWith(
				mockEndpoint,
				mockRequestData
			)
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

describe('handleAjaxErrors', () => {
	const mockEmitter = {
		emitNotificationEvent: jest.fn()
	}
	const mockKey = 'foo'
	const mockMsg = 'bar'

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should emit an error notification with the message if it exists', () => {
		const mockErrorResponse: MockErrorResponse = {
			response: {
				data: {
					key: mockKey,
					msg: mockMsg
				}
			}
		}

		//@ts-ignore
		handleAjaxErrors(mockErrorResponse, mockEmitter)

		expect(mockEmitter.emitNotificationEvent).toHaveBeenCalledWith(
			ev.error,
			mockMsg
		)
	})

	it('should emit an error notification with the key if there is no message', () => {
		const mockErrorResponse: MockErrorResponse = {
			response: {
				data: {
					key: mockKey
				}
			}
		}

		//@ts-ignore
		handleAjaxErrors(mockErrorResponse, mockEmitter)

		expect(mockEmitter.emitNotificationEvent).toHaveBeenCalledWith(
			ev.error,
			mockKey
		)
	})

	it('should not emit a notification event if the response is empty', () => {
		//@ts-ignore
		handleAjaxErrors({}, mockEmitter)

		expect(mockEmitter.emitNotificationEvent).not.toHaveBeenCalled()
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
			initialValues: mockInitialValues
		})

		expect(generatedPatch).toEqual({ firstName: 'Foo' })
	})

	it('should return an empty object if no changes are detected', () => {
		const generatedPatch = generatePatch<MockUser, MockUser>({
			fieldValues: mockInitialValues,
			initialValues: mockInitialValues
		})

		expect(generatedPatch).toEqual({})
	})
})
