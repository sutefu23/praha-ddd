import { AttendeeAttachedTask } from '@/domain/entity/AttendeeAttachedTask'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import type { AttendeeAttachedTask as AttendeeAttachedTaskModel } from '@prisma/client'
import { IAttendeeAttachedTaskQueryService } from '@/domain/interface/IAttendeeAttachedTaskQueryService'
import { TaskStatus } from '@/domain/valueObject/TaskStatus'
import { Attendee } from '@/domain/entity/Attendee'
import { AttendeeModelToEntity } from './AttendeeQueryService'
import { TaskModelToEntity } from './TaskQueryService'

export type AttendeeAttachedTaskModelWithTaskAndAttendee = {
  attendee: {
    id: string
    name: string
    email: string
    status: string
  }
  task: {
    id: string
    taskNumber: number
    content: string
  }
} & {
  id: string
  attendeeId: string
  taskId: string
  status: string
}

export class AttendeeAttachedTaskQueryService
  implements IAttendeeAttachedTaskQueryService<PrismaClientType> {
  public async findByTaskAndAttendeeId(
    client: PrismaClientType,
    TaskId: UUID,
    AttendeeId: UUID,
  ): Promise<QueryError | AttendeeAttachedTask | null> {
    try {
      const attendeeAttachedTaskModel = await client.attendeeAttachedTask.findFirst(
        {
          where: {
            taskId: TaskId.toString(),
            attendeeId: AttendeeId.toString(),
          },
          include: {
            task: true,
            attendee: true,
          },
        },
      )
      if (attendeeAttachedTaskModel === null) {
        return null
      }
      return AttendeeAttachedTaskModelToEntity(attendeeAttachedTaskModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
}

export function AttendeeAttachedTaskModelToEntity(
  model: AttendeeAttachedTaskModelWithTaskAndAttendee,
): AttendeeAttachedTask {
  return AttendeeAttachedTask.regen({
    id: UUID.restore(model.id),
    attendee: AttendeeModelToEntity(model.attendee),
    task: TaskModelToEntity(model.task),
    status: TaskStatus.restore(model.status),
  })
}
