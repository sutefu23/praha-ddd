import { Attendee } from '../entity/Attendee'
import { QueryError } from '../error/DomainError'
import { StatusEnum } from '../valueObject/EnrollmentStatus'

export interface IAttendeeQueryService {
  findAttendeeById: (id: string) => Promise<Attendee | null | QueryError>
  findAttendeeByName: (name: string) => Promise<Attendee | null | QueryError>
  findAttendeesByTeamId: (teamId: string) => Promise<Attendee[] | QueryError>
  findAllAttendees: () => Promise<Attendee[] | QueryError>
}

export type AttendeeDTO = {
  id: string
  name: string
  enrollment: StatusEnum
}
