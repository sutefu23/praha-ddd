import { Task } from '../entity/Task'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITaskRepository<ClientType = unknown> {
  save: (client: ClientType, task: Task) => Promise<void | RepositoryError>
  bulkSave: (
    client: ClientType,
    tasks: Task[],
  ) => Promise<void | RepositoryError>
  delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
