import { Pair } from '../entity/Pair'
import { QueryError } from '../error/DomainError'

import { IPairQueryService } from '../interface/IPairQueryService'

export class PairListGetUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly pairQueryService: IPairQueryService,
  ) {}

  async exec(): Promise<Pair[] | QueryError> {
    const pairs = await this.pairQueryService.findAllPairs(
      this.repositoryClient,
    )
    if (pairs instanceof QueryError) {
      return pairs // as QueryError
    }

    return pairs
  }
}
