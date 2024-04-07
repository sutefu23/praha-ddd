import { Task } from '../entity/Task'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { BaseRepository } from './base/BaseRepository'

export interface ITaskRepository extends BaseRepository {
  save: (task: Task) => Promise<void | RepositoryError>
  bulkSave: (tasks: Task[]) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
