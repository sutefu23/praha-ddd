import { Pair } from '../entity/Pair'
import { PairCollection } from '../entity/collection/PairCollection'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairQueryService {
  client: unknown
  findPairById: (id: UUID) => Promise<Pair | null | QueryError>
  findPairByName: (name: string) => Promise<Pair | null | QueryError>
  findPairByAttendeeId: (attendeeId: UUID) => Promise<Pair | null | QueryError>
  findPairsByPairIds: (pairIds: UUID[]) => Promise<Pair[] | QueryError>
  findAllPairs: () => Promise<PairCollection | QueryError>
}
