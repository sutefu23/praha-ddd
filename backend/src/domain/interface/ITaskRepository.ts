import { Task } from '../entity/Task'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITaskRepository {
  client: unknown
  save: (task: Task) => Promise<void | RepositoryError>
  bulkSave: (tasks: Task[]) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
