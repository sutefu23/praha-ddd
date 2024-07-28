import { Attendee } from '../entity/Attendee'
import { Pair } from '../entity/Pair'
import { PairAttendeeTooLessError } from '../entity/collection/PairAttendeeCollection'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'

import { IPairQueryService } from '../interface/IPairQueryService'
import { IPairRepository } from '../interface/IPairRepository'

export class PairDeleteAttendeeUsecase {
  constructor(
    private readonly pairRepository: IPairRepository,
    private readonly pairQueryService: IPairQueryService,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async exec(
    pairId: Pair['id'],
    attendeeId: Attendee['id'],
  ): Promise<Pair | InvalidParameterError | RepositoryError> {
    const pair = await this.pairQueryService.findPairById(pairId)
    if (pair instanceof QueryError) {
      return pair // as QueryError
    }

    if (pair === null) {
      return new InvalidParameterError('指定されたペアは存在しません。')
    }

    const attendee = await this.attendeeQueryService.findAttendeeById(
      attendeeId,
    )

    if (attendee instanceof QueryError) {
      return attendee // as QueryError
    }

    if (attendee === null) {
      return new InvalidParameterError('指定された参加者は存在しません。')
    }

    const newPair = pair.deleteAttendee(attendee)

    if (newPair instanceof PairAttendeeTooLessError) {
      return newPair // as PairAttendeeTooLessError
    }

    const res = await this.pairRepository.save(newPair)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return newPair
  }
}
