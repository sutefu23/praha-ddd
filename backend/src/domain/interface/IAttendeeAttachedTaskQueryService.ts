import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { QueryError } from '../error/DomainError'
import { PageQuery } from './PageQuery'
import { PageResponse } from './PageResponse'
import { Attendee } from '../entity/Attendee'
import { Task } from '../entity/Task'
export interface IAttendeeAttachedTaskQueryService<ClientType = unknown> {
  findByTaskAndAttendeeId: (
    client: ClientType,
    TaskId: Task['id'],
    AttendeeId: Attendee['id'],
  ) => Promise<AttendeeAttachedTask | null | QueryError>

  findByTaskStatus: (
    client: ClientType,
    TaskStatus: AttendeeAttachedTask['status'],
    PageQuery: PageQuery,
  ) => Promise<
    | { data: AttendeeAttachedTask[]; pageResponse: PageResponse }
    | QueryError
    | null
  >
}
