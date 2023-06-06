import { del, get, set } from 'idb-keyval'

export const deleteCachedWidgetData = (widgetId: string) => del(widgetId)

export const getCachedWidgetData = <T>(widgetId: string): Promise<T> =>
	get(widgetId).then((val: T) => val)

export const setCachedWidgetData = <T>(widgetId: string, data: T) =>
	set(widgetId, data)
