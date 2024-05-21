import { Attendee } from '../entity/Attendee'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IAttendeeRepository<ClientType = unknown> {
  save: (
    client: ClientType,
    attendee: Attendee,
  ) => Promise<void | RepositoryError>
  delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
