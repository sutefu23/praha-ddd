import { QueryError } from '../error/DomainError'

export interface IAttendeeAttachedTaskQueryService {
  findAttendeeAttachedTaskById: (
    id: string,
  ) => Promise<AttendeeAttachedTaskDTO | null | QueryError>
  findAttendeeAttachedTaskByName: (
    name: string,
  ) => Promise<AttendeeAttachedTaskDTO | null | QueryError>
  findAttendeeAttachedTasksByTeamId: (
    teamId: string,
  ) => Promise<AttendeeAttachedTaskDTO[] | QueryError>
  findAllAttendeeAttachedTasks: () => Promise<
    AttendeeAttachedTaskDTO[] | QueryError
  >
}

export type AttendeeAttachedTaskDTO = {
  uuid: string
  attendeeUUId: string
  taskUUId: string
  status: string
}
