import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'

import { AttendeeCreateUsecase } from '@/domain/usecase/AttendeeCreateUsecase'
import { CreateAttendeeProps } from '@/domain/entity/Attendee'
import { AttendeeGetUsecase } from '@/domain/usecase/AttendeeGetUsecase'
import { UUID } from '@/domain/valueObject/UUID'
import { InvalidParameterError, QueryError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { AttendeeListGetUsecase } from '@/domain/usecase/AttendeeListGetUsecase'
import { EnrollmentStatus } from '@/domain/valueObject/EnrollmentStatus'
import { AttendeeModifyStatusUsecase } from '@/domain/usecase/AttendeeModifyStatusUsecase'
@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeCreateUsecase: AttendeeCreateUsecase,
    private readonly attendeeGetUsecase: AttendeeGetUsecase,
    private readonly attendeeListGetUsecase: AttendeeListGetUsecase,
    private readonly attendeeModifyStatusUsecase: AttendeeModifyStatusUsecase,
  ) {}

  @Post()
  async create(@Body() body: CreateAttendeeProps) {
    return this.attendeeCreateUsecase.exec(body)
  }
  @Get()
  async getAll() {
    const res = await this.attendeeListGetUsecase.exec()
    if (res instanceof QueryError) {
      return ErrorHandler.handle(res)
    }
    return res
  }
  @Get(':id')
  async get(@Param('id') id: string) {
    const uuid = UUID.of(id)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }
    const res = await this.attendeeGetUsecase.exec(uuid)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }
    return res
  }
  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const uuid = UUID.of(id)
    if (uuid instanceof InvalidParameterError) {
      return ErrorHandler.handle(uuid)
    }

    const newStatus = EnrollmentStatus.parse(body.status)
    if (newStatus instanceof InvalidParameterError) {
      return ErrorHandler.handle(newStatus)
    }

    const res = await this.attendeeModifyStatusUsecase.exec(uuid, newStatus)
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }
    return res
  }
}
