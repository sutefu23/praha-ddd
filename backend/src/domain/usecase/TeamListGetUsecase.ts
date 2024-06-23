import { Team } from '../entity/Team'
import { QueryError } from '../error/DomainError'

import { ITeamQueryService } from '../interface/ITeamQueryService'

export class TeamListGetUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly teamQueryService: ITeamQueryService,
  ) {}

  async exec(): Promise<Team[] | QueryError> {
    const teams = await this.teamQueryService.findAllTeams(
      this.repositoryClient,
    )
    if (teams instanceof QueryError) {
      return teams // as QueryError
    }

    return teams
  }
}
