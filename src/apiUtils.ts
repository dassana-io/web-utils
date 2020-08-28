import jsonmergepatch from 'json-merge-patch'
import omit from 'lodash/omit'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosInstance } from 'axios'

export const DASSANA_REQUEST_ID = 'x-dassana-request-id'
export const TOKEN = 'token'

export const api: () => AxiosInstance = () =>
	axios.create({
		headers: {
			Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
			[DASSANA_REQUEST_ID]: uuidv4()
		}
	})

interface PatchInfo<T, U> {
	fieldValues: U
	initialValues: T
	keysToOmitFromPatch?: string | string[]
}

export const generatePatch = <T extends {}, U>({
	initialValues,
	fieldValues,
	keysToOmitFromPatch = []
}: PatchInfo<T, U>): U =>
	(jsonmergepatch.generate(
		omit(initialValues, keysToOmitFromPatch),
		fieldValues
	) || {}) as U
