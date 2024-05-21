import { AttendeeAttachedTask } from '@/domain/entity/AttendeeAttachedTask'
import { IAttendeeAttachedTaskRepository } from '@/domain/interface/IAttendeeAttachedTaskRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import type { PrismaClientType } from './db'
export class AttendeeAttachedTaskRepository
  implements IAttendeeAttachedTaskRepository<PrismaClientType> {
  public async save(
    client: PrismaClientType,
    attendeeAttachedTask: AttendeeAttachedTask,
  ): Promise<void | RepositoryError> {
    try {
      await client.attendeeAttachedTask.upsert({
        where: { id: attendeeAttachedTask.id.toString() },
        update: {
          attendeeId: attendeeAttachedTask.attendee.id.toString(),
          taskId: attendeeAttachedTask.task.id.toString(),
          status: attendeeAttachedTask.status.value,
        },
        create: {
          id: attendeeAttachedTask.id.toString(),
          attendeeId: attendeeAttachedTask.attendee.id.toString(),
          taskId: attendeeAttachedTask.task.id.toString(),
          status: attendeeAttachedTask.status.value,
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
