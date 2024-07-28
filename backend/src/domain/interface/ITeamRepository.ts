import { Team } from '../entity/Team'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface ITeamRepository {
  client: unknown
  save: (team: Team) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
