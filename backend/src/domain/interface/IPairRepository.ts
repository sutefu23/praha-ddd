import { Pair } from '../entity/Pair'
import { RepositoryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairRepository<ClientType = unknown> {
  save: (client: ClientType, Pair: Pair) => Promise<void | RepositoryError>
  delete: (client: ClientType, id: UUID) => Promise<void | RepositoryError>
}
