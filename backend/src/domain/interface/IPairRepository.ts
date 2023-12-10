import { Pair } from '../entity/Pair'
import { RepositoryError } from '../error/DomainError'

export interface IPairRepository {
  save: (Pair: Pair) => Promise<void | RepositoryError>
  delete: (Pair: Pair) => Promise<void | RepositoryError>
}
