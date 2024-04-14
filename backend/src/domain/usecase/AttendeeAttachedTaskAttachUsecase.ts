import { Attendee } from '../entity/Attendee'
import { Task } from '../entity/Task'
import {
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
} from '../error/DomainError'

import { ITaskQueryService } from '../interface/ITaskQueryService'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { IAttendeeAttachedTaskRepository } from '../interface/IAttendeeAttachedTaskRepository'

export class AttendeeAttachTaskUsecase {
  constructor(
    private readonly taskQueryService: ITaskQueryService,
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly attendeeAttachedTaskRepository: IAttendeeAttachedTaskRepository,
  ) {}

  async exec(
    targetTaskId: Task['id'],
    targetAttendeeId: Attendee['id'],
  ): Promise<
    | void
    | InvalidParameterError
    | QueryNotFoundError
    | QueryError
    | RepositoryError
  > {
    const task = await this.taskQueryService.findTaskById(targetTaskId)
    if (task instanceof QueryError) {
      return task // as QueryError
    }

    if (task === null) {
      return new QueryNotFoundError('指定された課題が存在しません')
    }

    const attendee = await this.attendeeQueryService.findAttendeeById(
      targetAttendeeId,
    )
    if (attendee instanceof QueryError) {
      return attendee
    }

    if (attendee === null) {
      return new QueryNotFoundError('指定された参加者が存在しません')
    }

    const newAttendeeAttachedTask = AttendeeAttachedTask.create({
      task,
      attendee,
    })

    if (newAttendeeAttachedTask instanceof InvalidParameterError) {
      return newAttendeeAttachedTask
    }

    const res = await this.attendeeAttachedTaskRepository.save(
      newAttendeeAttachedTask,
    )
    if (res instanceof RepositoryError) {
      return res
    }

    return res
  }
}
