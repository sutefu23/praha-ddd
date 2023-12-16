import { Pair } from '../entity/Pair'
import { QueryError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

export interface IPairQueryService {
  findPairById: (id: UUID) => Promise<Pair | null | QueryError>
  findPairByName: (name: string) => Promise<Pair | null | QueryError>
  findPairsByAttendeeId: (attendeeId: UUID) => Promise<Pair | null | QueryError>
  findAllPairs: () => Promise<Pair[] | QueryError>
}
