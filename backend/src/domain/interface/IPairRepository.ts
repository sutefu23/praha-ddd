import { Pair } from '../entity/Pair'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { BaseRepository } from './base/BaseRepository'

export interface IPairRepository extends BaseRepository {
  save: (Pair: Pair) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
