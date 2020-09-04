import mitt, { Emitter } from 'mitt'

export enum DassanaEventTypes {
	error = 'error',
	info = 'info',
	success = 'success',
	warning = 'warning'
}

export type DassanaEmitterType = Emitter

export const emitNotificationEvent = (
	type: DassanaEventTypes,
	message: string,
	emitter: Emitter
): void => emitter.emit(type, { message })

export const dassanaEmitter: Emitter = mitt()
