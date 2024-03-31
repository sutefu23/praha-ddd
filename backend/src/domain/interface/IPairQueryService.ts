import { Pair } from '../entity/Pair'
import { PairCollection } from '../entity/collection/PairCollection'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairQueryService {
  findPairById: (id: UUID) => Promise<Pair | null | QueryError>
  findPairByName: (name: string) => Promise<Pair | null | QueryError>
  findPairByAttendeeId: (attendeeId: UUID) => Promise<Pair | null | QueryError>
  findAllPairs: () => Promise<PairCollection | QueryError>
}
