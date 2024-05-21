import { Team } from '../entity/Team'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { TeamCollection } from '../entity/collection/TeamCollection'

export interface ITeamQueryService<ClientType = unknown> {
  findTeamById: (
    client: ClientType,
    id: UUID,
  ) => Promise<Team | null | QueryError>
  findTeamByName: (
    client: ClientType,
    name: string,
  ) => Promise<Team | null | QueryError>
  findTeamsByAttendeeId: (
    client: ClientType,
    attendeeId: UUID,
  ) => Promise<Team | null | QueryError>
  findAllTeams: (client: ClientType) => Promise<TeamCollection | QueryError>
}
