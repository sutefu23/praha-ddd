import { Attendee } from '../entity/Attendee'
import { RepositoryError } from '../error/DomainError'

export interface IAttendeeRepository {
  save: (attendee: Attendee) => Promise<Attendee | RepositoryError>
  delete: (name: string) => Promise<Attendee | RepositoryError>
}
