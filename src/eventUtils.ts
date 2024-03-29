import mitt, {
	type EventType,
	type Handler,
	type Emitter as mittEmitter
} from 'mitt'

export enum ev {
	error = 'error',
	info = 'info',
	success = 'success',
	warning = 'warning'
}

export enum EmitterEventTypes {
	drawerClosed = 'drawerClosed',
	drawerOpened = 'drawerOpened',
	getOrchestratorTopNavWidth = 'getOrchestratorTopNavWidth',
	loggedOut = 'loggedOut',
	logout = 'logout',
	offsetProfileIcon = 'offsetProfileIcon',
	profileUpdated = 'profileUpdated',
	themeUpdated = 'themeUpdated',
	triggerOrchestratorTopNav = 'triggerOrchestratorTopNav'
}

export interface NotificationEvent {
	message: string
}

export class Emitter implements mittEmitter {
	emitter: mittEmitter

	constructor() {
		this.emitter = mitt()
	}

	get all() {
		return this.emitter.all
	}

	emit = (event: EventType, value: string | object): void =>
		this.emitter.emit(event, value)

	emitNotificationEvent = (type: ev, message: string): void => {
		const event: NotificationEvent = { message }

		this.emit(type, event)
	}

	off = (event: EventType, handler: Handler): void =>
		this.emitter.off(event, handler)

	on = (event: EventType, handler: Handler): void =>
		this.emitter.on(event, handler)
}
