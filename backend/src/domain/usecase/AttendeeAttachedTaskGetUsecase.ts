import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import {
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
  UnPemitedOperationError,
} from '../error/DomainError'

import { IAttendeeAttachedTaskQueryService } from '../interface/IAttendeeAttachedTaskQueryService'
import { PageQuery } from '../interface/PageQuery'
import { PageResponse } from '../interface/PageResponse'
import { TaskStatus } from '../valueObject/TaskStatus'

export class AttendeeAttachedTaskGetUsecase {
  constructor(
    private readonly attendeeAttachedTaskQueryService: IAttendeeAttachedTaskQueryService,
  ) {}

  async exec(
    taskStatus: TaskStatus,
    pageQuery: PageQuery,
  ): Promise<
    | { data: AttendeeAttachedTask[]; pageResponse: PageResponse }
    | InvalidParameterError
    | QueryNotFoundError
    | UnPemitedOperationError
  > {
    const res = await this.attendeeAttachedTaskQueryService.findByTaskStatus(
      taskStatus,
      pageQuery,
    )
    if (res instanceof QueryError) {
      return res // as QueryError
    }

    if (res === null) {
      return new QueryNotFoundError('指定された課題が存在しません')
    }
    return res
  }
}
