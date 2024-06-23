import { Controller, Delete, Param, Post } from '@nestjs/common'

import { UUID } from '@/domain/valueObject/UUID'
import { InvalidParameterError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { PairDeleteAttendeeUsecase } from '@/domain/usecase/PairDeleteAttendeeUsecase'
import { PairAddAttendeeUsecase } from '@/domain/usecase/PairAddAttendeeUsecase'

@Controller('pair/:pairId/attendee')
export class PairController {
  constructor(
    private readonly pairDeleteAttendeeUsecase: PairDeleteAttendeeUsecase,
    private readonly pairAddAttendeeUsecase: PairAddAttendeeUsecase,
  ) {}

  @Post(':attendeeId')
  async addAttendee(
    @Param('pairId') pairId: string,
    @Param('attendeeId') attendeeId: string,
  ) {
    const uuid = UUID.of(pairId)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }

    const attendeeUUID = UUID.of(attendeeId)
    if (attendeeUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(attendeeUUID)
    }

    const res = await this.pairAddAttendeeUsecase.exec(uuid, attendeeUUID)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }

    return res
  }
  @Delete(':attendeeId')
  async deleteAttendee(
    @Param('pairId') pairId: string,
    @Param('attendeeId') attendeeId: string,
  ) {
    const uuid = UUID.of(pairId)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }

    const attendeeUUID = UUID.of(attendeeId)
    if (attendeeUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(attendeeUUID)
    }

    const res = await this.pairDeleteAttendeeUsecase.exec(uuid, attendeeUUID)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }

    return res
  }
}
