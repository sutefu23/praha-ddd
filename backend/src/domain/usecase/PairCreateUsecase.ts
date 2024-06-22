import { Attendee } from '../entity/Attendee'
import { Pair, CreatePairProps } from '../entity/Pair'
import { PairAttendeeCollection } from '../entity/collection/PairAttendeeCollection'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'

import { IPairQueryService } from '../interface/IPairQueryService'
import { IPairRepository } from '../interface/IPairRepository'

export class PairCreateUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly pairRepository: IPairRepository,
    private readonly pairQueryService: IPairQueryService,
  ) {}

  async exec(
    pairProps: CreatePairProps,
    attendees: Attendee[],
  ): Promise<Pair | InvalidParameterError | RepositoryError> {
    const hasPair = await this.pairQueryService.findPairByName(
      this.repositoryClient,
      pairProps.name.value,
    )
    if (hasPair instanceof QueryError) {
      return hasPair // as QueryError
    }

    if (hasPair !== null) {
      return new InvalidParameterError('同じ名前のペアが既に存在します。')
    }

    attendees.forEach((attendee) => {
      const pairAttendeeCollection = PairAttendeeCollection.create([attendee])
      if (pairAttendeeCollection instanceof UnPemitedOperationError) {
        return pairAttendeeCollection // as UnPemitedOperationError
      }
    })

    const pair = Pair.create(pairProps)
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
