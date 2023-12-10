import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { RepositoryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskTaskRepository {
  save: (
    AttendeeAttachedTask: AttendeeAttachedTask,
  ) => Promise<AttendeeAttachedTask | RepositoryError>
  delete: (name: string) => Promise<AttendeeAttachedTask | RepositoryError>
}
