import { Team } from '../entity/Team'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { BaseRepository } from './base/BaseRepository'

export interface ITeamRepository extends BaseRepository {
  save: (team: Team) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
