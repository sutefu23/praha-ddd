import { Pair } from '../entity/Pair'
import { Team } from '../entity/Team'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { IPairQueryService } from '../interface/IPairQueryService'

import { ITeamQueryService } from '../interface/ITeamQueryService'
import { ITeamRepository } from '../interface/ITeamRepository'
import { TeamName } from '../valueObject/TeamName'

export class TeamCreateUsecase {
  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
  ) {}

  async exec(
    name: TeamName,
    pairIds: Pair['id'][],
  ): Promise<Team | InvalidParameterError | RepositoryError> {
    const hasTeam = await this.teamQueryService.findTeamByName(name.value)
    if (hasTeam instanceof QueryError) {
      return hasTeam // as QueryError
    }

    if (hasTeam !== null) {
      return new InvalidParameterError('同じ名前のチームが既に存在します。')
    }

    const pairs = await this.pairQueryService.findPairsByPairIds(pairIds)
    if (pairs instanceof QueryError) {
      return pairs // as QueryError
    }

    const team = Team.create({
      name,
      pairs,
    })
    if (team instanceof UnPemitedOperationError) {
      return team // as UnPemitedOperationError
    }
    const res = await this.teamRepository.save(team)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return team
  }
}
