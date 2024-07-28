import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { QueryError } from '../error/DomainError'
import { PageQuery } from './PageQuery'
import { PageResponse } from './PageResponse'
import { Attendee } from '../entity/Attendee'
import { Task } from '../entity/Task'
export interface IAttendeeAttachedTaskQueryService {
  client: unknown
  findByTaskAndAttendeeId: (
    TaskId: Task['id'],
    AttendeeId: Attendee['id'],
  ) => Promise<AttendeeAttachedTask | null | QueryError>

  findByTaskStatus: (
    TaskStatus: AttendeeAttachedTask['status'],
    PageQuery: PageQuery,
  ) => Promise<
    | { data: AttendeeAttachedTask[]; pageResponse: PageResponse }
    | QueryError
    | null
  >
}
