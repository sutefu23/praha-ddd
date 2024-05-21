import { Task } from '../entity/Task'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITaskQueryService<ClientType = unknown> {
  findTaskById: (
    client: ClientType,
    id: UUID,
  ) => Promise<Task | null | QueryError>
  findTaskByTaskNumber: (
    client: ClientType,
    taskNumber: number,
  ) => Promise<Task | null | QueryError>
  findTasksByAttendeeId: (
    client: ClientType,
    attendeeId: UUID,
  ) => Promise<Task[] | null | QueryError>
}
