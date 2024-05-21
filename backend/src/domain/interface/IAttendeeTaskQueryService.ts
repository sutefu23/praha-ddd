import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { QueryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskQueryService<ClientType = unknown> {
  findAttendeeAttachedTaskById: (
    client: ClientType,
    id: string,
  ) => Promise<AttendeeAttachedTask | null | QueryError>
  findAttendeeAttachedTaskByName: (
    client: ClientType,
    name: string,
  ) => Promise<AttendeeAttachedTask | null | QueryError>
  findAttendeeAttachedTasksByTeamId: (
    client: ClientType,
    teamId: string,
  ) => Promise<AttendeeAttachedTask[] | QueryError>
  findAllAttendeeAttachedTasks: (
    client: ClientType,
  ) => Promise<AttendeeAttachedTask[] | QueryError>
}
