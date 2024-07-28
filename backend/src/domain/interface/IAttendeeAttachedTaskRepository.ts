import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { RepositoryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskRepository {
  client: unknown
  save: (
    AttendeeAttachedTask: AttendeeAttachedTask,
  ) => Promise<void | RepositoryError>
  // delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
