import { Task } from '@/domain/entity/Task'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import type { Task as TaskModel } from '@prisma/client'
import { ITaskQueryService } from '@/domain/interface/ITaskQueryService'

export class TaskQueryService implements ITaskQueryService {
  constructor(public readonly client: PrismaClientType) {}
  public async findTaskById(id: UUID): Promise<QueryError | Task | null> {
    try {
      const taskModel = await this.client.task.findUnique({
        where: { id: id.toString() },
      })
      if (taskModel === null) {
        return null
      }
      return TaskModelToEntity(taskModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findTaskByTaskNumber(
    taskNumber: number,
  ): Promise<Task | QueryError | null> {
    try {
      const taskModel = await this.client.task.findFirst({
        where: { taskNumber: taskNumber },
      })
      if (taskModel === null) {
        return null
      }
      return TaskModelToEntity(taskModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findTasksByAttendeeId(
    attendeeId: UUID,
  ): Promise<QueryError | Task[] | null> {
    try {
      const taskModel = await this.client.task.findMany({
        where: {
          AttendeeAttachedTask: {
            some: {
              attendeeId: attendeeId.toString(),
            },
          },
        },
        include: {
          AttendeeAttachedTask: true,
        },
      })
      if (taskModel === null) {
        return null
      }
      return taskModel.map(TaskModelToEntity)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
}

export function TaskModelToEntity(taskModel: TaskModel): Task {
  return Task.regen({
    id: UUID.mustParse(taskModel.id),
    taskNumber: taskModel.taskNumber,
    content: taskModel.content,
  })
}
