import { QueryError } from '../error/DomainError'
import { AttendeeDTO } from './IAttendeeQueryService'

export interface ITeamQueryService {
  findTeamById: (id: string) => Promise<TeamDTO | null | QueryError>
  findTeamByName: (name: string) => Promise<TeamDTO | null | QueryError>
  findTeamsByAttendeeId: (
    attendeeId: string,
  ) => Promise<TeamDTO | null | QueryError>
  findAllTeams: () => Promise<TeamDTO[] | QueryError>
}

export type TeamDTO = {
  id: string
  name: string
  attendees: AttendeeDTO[]
}
