import { Task, CreateTaskProps } from '../entity/Task'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'

import { ITaskQueryService } from '../interface/ITaskQueryService'
import { ITaskRepository } from '../interface/ITaskRepository'

export class TaskCreateUsecase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly taskQueryService: ITaskQueryService,
  ) {}

  async exec(
    taskProps: CreateTaskProps,
  ): Promise<Task | InvalidParameterError | RepositoryError> {
    const hasTask = await this.taskQueryService.findTaskByTaskNumber(
      taskProps.taskNumber,
    )
    if (hasTask instanceof QueryError) {
      return hasTask // as QueryError
    }

    if (hasTask !== null) {
      return new InvalidParameterError('同じタスク番号の課題が既に存在します。')
    }
    const task = Task.create(taskProps)
    if (task instanceof UnPemitedOperationError) {
      return task // as UnPemitedOperationError
    }
    const res = await this.taskRepository.save(task)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return task
  }
}
