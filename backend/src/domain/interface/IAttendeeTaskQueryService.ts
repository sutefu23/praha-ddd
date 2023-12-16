import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { QueryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskQueryService {
  findAttendeeAttachedTaskById: (
    id: string,
  ) => Promise<AttendeeAttachedTask | null | QueryError>
  findAttendeeAttachedTaskByName: (
    name: string,
  ) => Promise<AttendeeAttachedTask | null | QueryError>
  findAttendeeAttachedTasksByTeamId: (
    teamId: string,
  ) => Promise<AttendeeAttachedTask[] | QueryError>
  findAllAttendeeAttachedTasks: () => Promise<
    AttendeeAttachedTask[] | QueryError
  >
}
