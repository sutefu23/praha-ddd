import { Team, CreateTeamProps } from '../entity/Team'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'

import { ITeamQueryService } from '../interface/ITeamQueryService'
import { ITeamRepository } from '../interface/ITeamRepository'

export class TeamCreateUsecase {
  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly teamQueryService: ITeamQueryService,
  ) {}

  async exec(
    teamProps: CreateTeamProps,
  ): Promise<Team | InvalidParameterError | RepositoryError> {
    const hasTeam = await this.teamQueryService.findTeamByName(
      teamProps.name.value,
    )
    if (hasTeam instanceof QueryError) {
      return hasTeam // as QueryError
    }

    if (hasTeam !== null) {
      return new InvalidParameterError('同じメールの登録者が既に存在します。')
    }
    const team = Team.create(teamProps)
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
