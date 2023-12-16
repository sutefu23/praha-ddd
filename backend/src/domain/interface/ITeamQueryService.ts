import { Team } from '../entity/Team'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITeamQueryService {
  findTeamById: (id: UUID) => Promise<Team | null | QueryError>
  findTeamByName: (name: string) => Promise<Team | null | QueryError>
  findTeamsByAttendeeId: (
    attendeeId: string,
  ) => Promise<Team | null | QueryError>
  findAllTeams: () => Promise<Team[] | QueryError>
}
