import { Attendee } from '../entity/Attendee'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IAttendeeRepository {
  client: unknown
  save: (attendee: Attendee) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
