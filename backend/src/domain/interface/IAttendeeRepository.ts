import { Attendee } from '../entity/Attendee'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { BaseRepository } from './base/BaseRepository'

export interface IAttendeeRepository extends BaseRepository {
  save: (attendee: Attendee) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
