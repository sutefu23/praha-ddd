import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common'

import { UUID } from '@/domain/valueObject/UUID'
import { InvalidParameterError, QueryError } from '@/domain/error/DomainError'
import { ErrorHandler } from './ErrorHandler'
import { TaskStatus } from '@/domain/valueObject/TaskStatus'
import { AttendeeAttachedTaskModifyStatusUsecase } from '@/domain/usecase/AttendeeAttachedTaskModifyStatusUsecase'
import { AttendeeAttachedTaskGetUsecase } from '@/domain/usecase/AttendeeAttachedTaskGetUsecase'
import { PageQuery } from '@/domain/interface/PageQuery'
@Controller('task')
export class AttendeeAttachedTaskController {
  constructor(
    private readonly attendeeAttachedTaskGetUsecase: AttendeeAttachedTaskGetUsecase,
    private readonly attendeeAttachedTaskModifyStatusUsecase: AttendeeAttachedTaskModifyStatusUsecase,
  ) {}

  @Get(':taskStatus/:page')
  async getTasks(
    @Param('status') taskStatus: string,
    @Param('page', ParseIntPipe) page: number,
  ) {
    const pageQuery = new PageQuery(page)
    const newStatus = TaskStatus.parse(taskStatus)
    if (newStatus instanceof InvalidParameterError) {
      return ErrorHandler.handle(newStatus)
    }
    const res = await this.attendeeAttachedTaskGetUsecase.exec(
      newStatus,
      pageQuery,
    )
    if (res instanceof QueryError) {
      return ErrorHandler.handle(res)
    }
    return res
  }

  @Put('attendee/:attendeeId/:taskId')
  async updateStatus(
    @Param('attendeeId') attendeeId: string,
    @Param('taskId') TaskId: string,
    @Body() body: { status: string },
  ) {
    const attendeeUUID = UUID.of(attendeeId)
    if (attendeeUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(attendeeUUID)
    }
    const TaskUUID = UUID.of(TaskId)
    if (TaskUUID instanceof InvalidParameterError) {
      return ErrorHandler.handle(TaskUUID)
    }

    const newStatus = TaskStatus.parse(body.status)
    if (newStatus instanceof InvalidParameterError) {
      return ErrorHandler.handle(newStatus)
    }

    const res = await this.attendeeAttachedTaskModifyStatusUsecase.exec(
      attendeeUUID,
      TaskUUID,
      newStatus,
    )
    if (res instanceof Error) {
      return ErrorHandler.handle(res)
    }
    return res
  }
}
