import { Attendee } from '../entity/Attendee'
import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { Task } from '../entity/Task'
import { QueryError } from '../error/DomainError'
export interface IAttendeeAttachedTaskQueryService {
  findByTaskAndAttendeeId: (
    TaskId: Task['id'],
    AttendeeId: Attendee['id'],
  ) => Promise<AttendeeAttachedTask | null | QueryError>
}
