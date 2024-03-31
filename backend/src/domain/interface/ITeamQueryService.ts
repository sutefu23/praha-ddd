import { Team } from '../entity/Team'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { TeamCollection } from '../entity/collection/TeamCollection'

export interface ITeamQueryService {
  findTeamById: (id: UUID) => Promise<Team | null | QueryError>
  findTeamByName: (name: string) => Promise<Team | null | QueryError>
  findTeamsByAttendeeId: (attendeeId: UUID) => Promise<Team | null | QueryError>
  findAllTeams: () => Promise<TeamCollection | QueryError>
}
