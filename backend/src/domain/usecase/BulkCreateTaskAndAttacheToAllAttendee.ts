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
import { ITaskRepository } from '../interface/ITaskRepository'

export class BulkCreateTaskAndAttacheToAllAttendee {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly taskQueryService: ITaskQueryService,
    private readonly taskRepository: ITaskRepository,
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly attendeeAttachedTaskRepository: IAttendeeAttachedTaskRepository,
  ) {}
  // 一括で課題を作成し、全参加者に課題をアタッチする
  async exec(
    taskContents: string[],
    taskNumberOffset = 1,
  ): Promise<void | QueryNotFoundError | RepositoryError> {
    const taskPromises = taskContents.map(async (content, index) => {
      const task = Task.create({
        content,
        taskNumber: index + taskNumberOffset,
      })
      if (task instanceof InvalidParameterError) {
        return task
      }
      const res = await this.taskRepository.save(this.repositoryClient, task)
      if (res instanceof RepositoryError) {
        return res
      }
      return task
    })
    const tasks = await Promise.all(taskPromises)
    const attendees = await this.attendeeQueryService.findAllAttendees(
      this.repositoryClient,
    )

    if (attendees instanceof QueryError) {
      return attendees // as QueryError
    }

    if (tasks.some((task) => task instanceof RepositoryError)) {
      throw new QueryError('Failed to save task')
    }

    const attendeeAttachedTaskPromises = tasks.map(async (task) => {
      if (task instanceof RepositoryError) {
        return task
      }
      const attendeeAttachedTaskPromises = attendees.map(async (attendee) => {
        const newAttendeeAttachedTask = AttendeeAttachedTask.create({
          task,
          attendee,
        })
        if (newAttendeeAttachedTask instanceof InvalidParameterError) {
          return newAttendeeAttachedTask
        }
        const res = await this.attendeeAttachedTaskRepository.save(
          this.repositoryClient,
          newAttendeeAttachedTask,
        )
        if (res instanceof RepositoryError) {
          return res
        }
        return newAttendeeAttachedTask
      })
      return Promise.all(attendeeAttachedTaskPromises)
    })
    await Promise.all(attendeeAttachedTaskPromises)
  }
}
