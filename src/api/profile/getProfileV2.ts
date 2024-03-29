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
import { type BaseProfileV2 } from './baseProfileV2'
import { Persona } from './persona'
import { type TimezoneV2 } from './timezoneV2'

export interface GetProfileV2 extends BaseProfileV2 {
	id: string
	timezone?: TimezoneV2
}
