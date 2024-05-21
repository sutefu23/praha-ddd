import { Attendee } from '../entity/Attendee'
import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { Task } from '../entity/Task'
import { QueryError } from '../error/DomainError'
export interface IAttendeeAttachedTaskQueryService<ClientType = unknown> {
  findByTaskAndAttendeeId: (
    client: ClientType,
    TaskId: Task['id'],
    AttendeeId: Attendee['id'],
  ) => Promise<AttendeeAttachedTask | null | QueryError>
}
