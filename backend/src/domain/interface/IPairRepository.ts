import { Pair } from '../entity/Pair'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairRepository {
  client: unknown
  save: (Pair: Pair) => Promise<void | RepositoryError>
  delete: (id: UUID) => Promise<void | RepositoryError>
}
