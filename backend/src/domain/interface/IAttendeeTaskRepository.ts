import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { BaseRepository } from './base/BaseRepository'
export interface IAttendeeAttachedTaskTaskRepository extends BaseRepository {
  save: (
    AttendeeAttachedTask: AttendeeAttachedTask,
  ) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
