import { AttendeeAttachedTask } from '@/domain/entity/AttendeeAttachedTask'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import type {
  AttendeeAttachedTask as AttendeeAttachedTaskModel,
  Attendee as AttendeeModel,
  Task as TaskModel,
} from '@prisma/client'
import { IAttendeeAttachedTaskQueryService } from '@/domain/interface/IAttendeeAttachedTaskQueryService'
import { TaskStatus } from '@/domain/valueObject/TaskStatus'
import { AttendeeModelToEntity } from './AttendeeQueryService'
import { TaskModelToEntity } from './TaskQueryService'

export type AttendeeAttachedTaskModelWithTaskAndAttendee = {
  attendee: AttendeeModel
  task: TaskModel
} & AttendeeAttachedTaskModel

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
    id: UUID.mustParse(model.id),
    attendee: AttendeeModelToEntity(model.attendee),
    task: TaskModelToEntity(model.task),
    status: TaskStatus.mustParse(model.status),
  })
}
