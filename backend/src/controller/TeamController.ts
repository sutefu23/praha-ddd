import { Body, Controller, Get, Post } from '@nestjs/common'

import { TeamCreateUsecase } from '@/domain/usecase/TeamCreateUsecase'
import { UUID } from '@/domain/valueObject/UUID'
import { InvalidParameterError, QueryError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { TeamListGetUsecase } from '@/domain/usecase/TeamListGetUsecase'
import { TeamName } from '@/domain/valueObject/TeamName'

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamCreateUsecase: TeamCreateUsecase,
    private readonly teamListGetUsecase: TeamListGetUsecase,
  ) {}

  @Post()
  async create(@Body() body: { teamName: string; pairIds: string[] }) {
    const teamName = TeamName.new(body.teamName)
    if (teamName instanceof InvalidParameterError) {
      return ErrorHandler.handle(teamName)
    }
    const pairIds = body.pairIds.map((id) => UUID.of(id))
    if (pairIds.some((id) => id instanceof InvalidParameterError)) {
      const error = pairIds.filter(
        (id) => id instanceof InvalidParameterError,
      )[0]
      if (error instanceof InvalidParameterError) {
        return ErrorHandler.handle(error)
      }
      if (error === undefined) {
        return ErrorHandler.handle(new Error('undefined error'))
      }
    }
    return this.teamCreateUsecase.exec(teamName, pairIds as UUID[])
  }
  @Get()
  async getAll() {
    const res = await this.teamListGetUsecase.exec()
    if (res instanceof QueryError) {
      return ErrorHandler.handle(res)
    }
    return res
  }
}
