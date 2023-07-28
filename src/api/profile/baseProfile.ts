/**
 * Dassana Profile Service
 * This API provides profile management capabilities like editing of name etc
 *
 * OpenAPI spec version: 1.0.5
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { type Persona } from './persona'
import { type Timezone } from './timezone'
import { type UserName } from './userName'
import { WorkTimes } from './workTimes'

export interface BaseProfile extends UserName {
	workStart?: number
	workEnd?: number
	timeZoneId?: string
	timeZone?: Timezone
	personas?: Persona[]
}
