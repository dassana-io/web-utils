import mitt, { Emitter } from 'mitt'

export enum DassanaEventTypes {
	error = 'error',
	info = 'info',
	success = 'success',
	warning = 'warning'
}

export const dassanaEmitter: Emitter = mitt()
