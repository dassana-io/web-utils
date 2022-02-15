declare module 'can-ndjson-stream' {
	export interface StreamedResponse<T> {
		done: boolean
		value: T
	}

	export default function ndjsonStream<T>(
		data: ReadableStream<Uint8Array> | null
	): {
		getReader: () => {
			read: () => Promise<StreamedResponse<T>>
		}
		cancel: () => void
	}
}
