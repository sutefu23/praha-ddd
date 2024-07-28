import { Task } from '@/domain/entity/Task'
import { ITaskRepository } from '@/domain/interface/ITaskRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import type { PrismaClientType } from './db'
export class TaskRepository implements ITaskRepository {
  constructor(public readonly client: PrismaClientType) {}

  public async bulkSave(tasks: Task[]): Promise<void | RepositoryError> {
    try {
      await this.client.task.createMany({
        data: tasks.map((task) => {
          return {
            id: task.id.toString(),
            taskNumber: task.taskNumber,
            content: task.content,
          }
        }),
      })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
  public async save(task: Task): Promise<void | RepositoryError> {
    try {
      await this.client.task.upsert({
        where: { id: task.id.toString() },
        update: { taskNumber: task.taskNumber, content: task.content },
        create: {
          id: task.id.toString(),
          taskNumber: task.taskNumber,
          content: task.content,
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
  public async delete(id: UUID): Promise<void | RepositoryError> {
    try {
      await this.client.task.delete({ where: { id: id.toString() } })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
