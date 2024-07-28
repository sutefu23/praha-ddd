import { Attendee } from '../entity/Attendee'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IAttendeeQueryService {
  client: unknown
  findAttendeeById: (id: UUID) => Promise<Attendee | null | QueryError>
  findAttendeeByEmail: (email: string) => Promise<Attendee | null | QueryError>
  findAttendeesByTeamId: (teamId: string) => Promise<Attendee[] | QueryError>
  findAllAttendees: () => Promise<Attendee[] | QueryError>
  findAttendeesByIds: (ids: UUID[]) => Promise<Attendee[] | QueryError>
}
