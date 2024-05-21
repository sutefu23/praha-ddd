import { Pair } from '../entity/Pair'
import { PairCollection } from '../entity/collection/PairCollection'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairQueryService<ClientType = unknown> {
  findPairById: (
    client: ClientType,
    id: UUID,
  ) => Promise<Pair | null | QueryError>
  findPairByName: (
    client: ClientType,
    name: string,
  ) => Promise<Pair | null | QueryError>
  findPairByAttendeeId: (
    client: ClientType,
    attendeeId: UUID,
  ) => Promise<Pair | null | QueryError>
  findAllPairs: (client: ClientType) => Promise<PairCollection | QueryError>
}
