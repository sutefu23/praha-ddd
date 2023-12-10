import { QueryError } from '../error/DomainError'
import { AttendeeDTO } from './IAttendeeQueryService'

export interface IPairQueryService {
  findPairById: (id: string) => Promise<PairDTO | null | QueryError>
  findPairByName: (name: string) => Promise<PairDTO | null | QueryError>
  findPairsByAttendeeId: (
    attendeeId: string,
  ) => Promise<PairDTO | null | QueryError>
  findAllPairs: () => Promise<PairDTO[] | QueryError>
}

export type PairDTO = {
  id: string
  name: string
  attendees: AttendeeDTO[]
}
