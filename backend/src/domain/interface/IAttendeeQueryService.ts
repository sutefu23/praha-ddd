import { Attendee } from '../entity/Attendee'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IAttendeeQueryService<ClientType = unknown> {
  findAttendeeById: (
    client: ClientType,
    id: UUID,
  ) => Promise<Attendee | null | QueryError>
  findAttendeeByEmail: (
    client: ClientType,
    email: string,
  ) => Promise<Attendee | null | QueryError>
  findAttendeesByTeamId: (
    client: ClientType,
    teamId: string,
  ) => Promise<Attendee[] | QueryError>
  findAllAttendees: (client: ClientType) => Promise<Attendee[] | QueryError>
  findAttendeesByIds: (
    client: ClientType,
    ids: UUID[],
  ) => Promise<Attendee[] | QueryError>
}
