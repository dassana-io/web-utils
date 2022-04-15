export * from './persona.service';
import { PersonaService } from './persona.service';
export * from './persona.serviceInterface'
export * from './profile.service';
import { ProfileService } from './profile.service';
export * from './profile.serviceInterface'
export * from './timezone.service';
import { TimezoneService } from './timezone.service';
export * from './timezone.serviceInterface'
export const APIS = [PersonaService, ProfileService, TimezoneService];
