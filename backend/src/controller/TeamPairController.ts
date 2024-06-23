import { Controller, Delete, Param, Post } from '@nestjs/common'

import { UUID } from '@/domain/valueObject/UUID'
import { InvalidParameterError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { TeamDeletePairUsecase } from '@/domain/usecase/TeamDeletePairUsecase'
import { TeamAddPairUsecase } from '@/domain/usecase/TeamAddPairUsecase'

@Controller('team/:teamId/pair')
export class TeamController {
  constructor(
    private readonly teamDeletePairUsecase: TeamDeletePairUsecase,
    private readonly teamAddPairUsecase: TeamAddPairUsecase,
  ) {}

  @Post(':pairId')
  async addPair(
    @Param('teamId') teamId: string,
    @Param('pairId') pairId: string,
  ) {
    const uuid = UUID.of(teamId)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }

    const pairUUID = UUID.of(pairId)
    if (pairUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(pairUUID)
    }

    const res = await this.teamAddPairUsecase.exec(uuid, pairUUID)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }

    return res
  }
  @Delete(':pairId')
  async deletePair(
    @Param('teamId') teamId: string,
    @Param('pairId') pairId: string,
  ) {
    const uuid = UUID.of(teamId)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }

    const pairUUID = UUID.of(pairId)
    if (pairUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(pairUUID)
    }

    const res = await this.teamDeletePairUsecase.exec(uuid, pairUUID)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }

    return res
  }
}
