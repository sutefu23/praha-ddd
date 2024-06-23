import { Pair } from '../entity/Pair'
import { Team } from '../entity/Team'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { IPairQueryService } from '../interface/IPairQueryService'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { ITeamRepository } from '../interface/ITeamRepository'

export class TeamDeletePairUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly teamRepository: ITeamRepository,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
  ) {}

  async exec(
    teamId: Team['id'],
    pairId: Pair['id'],
  ): Promise<Team | InvalidParameterError | RepositoryError> {
    const team = await this.teamQueryService.findTeamById(
      this.repositoryClient,
      teamId,
    )
    if (team instanceof QueryError) {
      return team // as QueryError
    }

    if (team === null) {
      return new InvalidParameterError('指定されたチームは存在しません。')
    }

    const pair = await this.pairQueryService.findPairById(
      this.repositoryClient,
      pairId,
    )

    if (pair instanceof QueryError) {
      return pair // as QueryError
    }

    if (pair === null) {
      return new InvalidParameterError('指定されたペアは存在しません。')
    }

    const newTeam = team.deletePair(pair)

    const res = await this.teamRepository.save(this.repositoryClient, newTeam)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return newTeam
  }
}
