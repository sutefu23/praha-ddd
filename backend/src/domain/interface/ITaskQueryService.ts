import { Task } from '../entity/Task'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITaskQueryService {
  client: unknown
  findTaskById: (id: UUID) => Promise<Task | null | QueryError>
  findTaskByTaskNumber: (
    taskNumber: number,
  ) => Promise<Task | null | QueryError>
  findTasksByAttendeeId: (
    attendeeId: UUID,
  ) => Promise<Task[] | null | QueryError>
}
