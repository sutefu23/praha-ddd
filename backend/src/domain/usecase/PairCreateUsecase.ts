import { Attendee } from '../entity/Attendee'
import { Pair } from '../entity/Pair'
import { PairAttendeeCollection } from '../entity/collection/PairAttendeeCollection'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'

import { IPairQueryService } from '../interface/IPairQueryService'
import { IPairRepository } from '../interface/IPairRepository'
import { PairName } from '../valueObject/PairName'

export class PairCreateUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly pairRepository: IPairRepository,
    private readonly pairQueryService: IPairQueryService,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async exec(
    pairName: PairName,
    attendeeIds: Attendee['id'][],
  ): Promise<Pair | InvalidParameterError | RepositoryError> {
    const hasPair = await this.pairQueryService.findPairByName(
      this.repositoryClient,
      pairName.value,
    )
    if (hasPair instanceof QueryError) {
      return hasPair // as QueryError
    }

    if (hasPair !== null) {
      return new InvalidParameterError('同じ名前のペアが既に存在します。')
    }

    const attendees = await this.attendeeQueryService.findAttendeesByIds(
      this.repositoryClient,
      attendeeIds,
    )

    if (attendees instanceof QueryError) {
      return attendees // as QueryError
    }

    attendees.forEach((attendee) => {
      const pairAttendeeCollection = PairAttendeeCollection.create([attendee])
      if (pairAttendeeCollection instanceof UnPemitedOperationError) {
        return pairAttendeeCollection // as UnPemitedOperationError
      }
    })

    const pair = Pair.create({ name: pairName, attendees })
    if (pair instanceof UnPemitedOperationError) {
      return pair // as UnPemitedOperationError
    }
    const res = await this.pairRepository.save(this.repositoryClient, pair)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return pair
  }
}
