import { Attendee } from '../entity/Attendee'
import { Task } from '../entity/Task'
import {
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'

import { IAttendeeAttachedTaskQueryService } from '../interface/IAttendeeAttachedTaskQueryService'
import { IAttendeeAttachedTaskRepository } from '../interface/IAttendeeAttachedTaskRepository'
import { TaskStatus } from '../valueObject/TaskStatus'

export class AttendeeAttachedTaskModifyStatusUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly attendeeAttachedTaskRepository: IAttendeeAttachedTaskRepository,
    private readonly attendeeAttachedTaskQueryService: IAttendeeAttachedTaskQueryService,
  ) {}

  async exec(
    authAttendeeId: Attendee['id'],
    targetTaskId: Task['id'],
    newStatus: TaskStatus,
  ): Promise<
    void | InvalidParameterError | QueryNotFoundError | UnPemitedOperationError
  > {
    const attendeeAttachedTask = await this.attendeeAttachedTaskQueryService.findByTaskAndAttendeeId(
      this.repositoryClient,
      targetTaskId,
      authAttendeeId,
    )
    if (attendeeAttachedTask instanceof QueryError) {
      return attendeeAttachedTask // as QueryError
    }

    if (attendeeAttachedTask === null) {
      return new QueryNotFoundError('指定された課題が存在しません')
    }

    if (attendeeAttachedTask.attendee.id !== authAttendeeId) {
      return new UnPemitedOperationError('課題の変更権限がありません')
    }

    const newAttendeeAttachedTask = attendeeAttachedTask.modifyStatus(newStatus)
    if (newAttendeeAttachedTask instanceof InvalidParameterError) {
      return newAttendeeAttachedTask // as InvalidParameterError
    }

    const res = await this.attendeeAttachedTaskRepository.save(
      this.repositoryClient,
      newAttendeeAttachedTask,
    )
    if (res instanceof RepositoryError) {
      return res
    }

    return res
  }
}
