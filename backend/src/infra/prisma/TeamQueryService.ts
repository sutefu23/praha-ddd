import { Team } from '@/domain/entity/Team'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import type { Team as TeamModel, TeamPairList } from '@prisma/client'
import { ITeamQueryService } from '@/domain/interface/ITeamQueryService'
import { TeamCollection } from '@/domain/entity/collection/TeamCollection'
import { TeamName } from '@/domain/valueObject/TeamName'
import { PairModelToEntity, PairModelWithAttendee } from './PairQueryService'
import { PairCollection } from '@/domain/entity/collection/PairCollection'

export type TeamModelWithPair = {
  TeamPairList: ({
    pair: PairModelWithAttendee
  } & TeamPairList)[]
} & TeamModel

export class TeamQueryService implements ITeamQueryService {
  constructor(public readonly client: PrismaClientType) {}

  public async findTeamsByAttendeeId(
    attendeeId: UUID,
  ): Promise<QueryError | Team | null> {
    try {
      const teamModel = await this.client.team.findFirst({
        where: {
          TeamPairList: {
            some: {
              pair: {
                PairAttendeeList: {
                  some: {
                    attendeeId: attendeeId.toString(),
                  },
                },
              },
            },
          },
        },
        include: {
          TeamPairList: {
            include: {
              pair: {
                include: { PairAttendeeList: { include: { attendee: true } } },
              },
            },
          },
        },
      })
      if (teamModel === null) {
        return null
      }
      return TeamModelToEntity(teamModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findTeamById(id: UUID): Promise<Team | QueryError | null> {
    try {
      const teamModel = await this.client.team.findUnique({
        where: { id: id.toString() },
        include: {
          TeamPairList: {
            include: {
              pair: {
                include: { PairAttendeeList: { include: { attendee: true } } },
              },
            },
          },
        },
      })
      if (teamModel === null) {
        return null
      }
      return TeamModelToEntity(teamModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findTeamsByPairId(
    attendeeId: UUID,
  ): Promise<Team | QueryError | null> {
    try {
      const teamModel = await this.client.team.findFirst({
        where: {
          TeamPairList: {
            some: {
              pair: {
                id: attendeeId.toString(),
              },
            },
          },
        },
        include: {
          TeamPairList: {
            include: {
              pair: {
                include: { PairAttendeeList: { include: { attendee: true } } },
              },
            },
          },
        },
      })
      if (teamModel === null) {
        return null
      }
      return TeamModelToEntity(teamModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findAllTeams(): Promise<QueryError | TeamCollection> {
    try {
      const teamModels = await this.client.team.findMany({
        include: {
          TeamPairList: {
            include: {
              pair: {
                include: { PairAttendeeList: { include: { attendee: true } } },
              },
            },
          },
        },
      })
      return TeamCollection.create(
        teamModels.map((teamModel) => TeamModelToEntity(teamModel)),
      )
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return new QueryError('Unknown error')
  }
  public async findTeamByName(name: string): Promise<Team | QueryError | null> {
    try {
      const teamModel = await this.client.team.findFirst({
        where: { name: name },
        include: {
          TeamPairList: {
            include: {
              pair: {
                include: { PairAttendeeList: { include: { attendee: true } } },
              },
            },
          },
        },
      })
      if (teamModel === null) {
        return null
      }
      return TeamModelToEntity(teamModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
}

function TeamModelToEntity(teamModel: TeamModelWithPair): Team {
  const teamPairList = teamModel.TeamPairList.map((teamPair) => {
    return PairModelToEntity(teamPair.pair)
  })
  return Team.regen({
    id: UUID.mustParse(teamModel.id),
    name: TeamName.mustParse(teamModel.name),
    pairs: PairCollection.create(teamPairList),
  })
}
