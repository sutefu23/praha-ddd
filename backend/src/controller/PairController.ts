import { Body, Controller, Get, Post } from '@nestjs/common'

import { PairCreateUsecase } from '@/domain/usecase/PairCreateUsecase'
import { UUID } from '@/domain/valueObject/UUID'
import { QueryError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { PairListGetUsecase } from '@/domain/usecase/PairListGetUsecase'
import { PairName } from '@/domain/valueObject/PairName'

@Controller('pair')
export class PairController {
  constructor(
    private readonly pairCreateUsecase: PairCreateUsecase,
    private readonly pairListGetUsecase: PairListGetUsecase,
  ) {}

  @Post()
  async create(@Body() body: { pairName: string; attendeeIds: string[] }) {
    const pairName = PairName.new(body.pairName)
    if (pairName instanceof Error) {
      return ErrorHandler.handle(pairName)
    }

    const attendeeUUIDs = body.attendeeIds.map((id) => UUID.of(id))
    if (attendeeUUIDs.some((id) => id instanceof Error)) {
      const error = attendeeUUIDs.filter((id) => id instanceof Error)[0]
      if (error instanceof Error) {
        return ErrorHandler.handle(error)
      }
      if (error === undefined) {
        return ErrorHandler.handle(new Error('undefined error'))
      }
    }
    return this.pairCreateUsecase.exec(pairName, attendeeUUIDs as UUID[])
  }
  @Get()
  async getAll() {
    const res = await this.pairListGetUsecase.exec()
    if (res instanceof QueryError) {
      return ErrorHandler.handle(res)
    }
    return res
  }
}
