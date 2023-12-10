import { Team } from '../entity/Team'
import { RepositoryError } from '../error/DomainError'

export interface ITeamRepository {
  save: (team: Team) => Promise<void | RepositoryError>
  delete: (team: Team) => Promise<void | RepositoryError>
}
