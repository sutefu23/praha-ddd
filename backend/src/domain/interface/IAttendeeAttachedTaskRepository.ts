import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { RepositoryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskRepository<ClientType = unknown> {
  save: (
    client: ClientType,
    AttendeeAttachedTask: AttendeeAttachedTask,
  ) => Promise<void | RepositoryError>
  // delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
