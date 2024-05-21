import { Team } from '../entity/Team'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITeamRepository<ClientType = unknown> {
  save: (client: ClientType, team: Team) => Promise<void | RepositoryError>
  delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
