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
import { PageResponse } from '@/domain/interface/PageResponse'

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
  public async findByTaskStatus(
    client: PrismaClientType,
    TaskStatus: TaskStatus,
    PageQuery: { page: number; perPage: number },
  ): Promise<
    | QueryError
    | null
    | { data: AttendeeAttachedTask[]; pageResponse: PageResponse }
  > {
    try {
      const [attendeeAttachedTaskModels, total] = await Promise.all([
        client.attendeeAttachedTask.findMany({
          where: {
            status: TaskStatus.toString(),
          },
          include: {
            task: true,
            attendee: true,
          },
          skip: PageQuery.page * PageQuery.perPage,
          take: PageQuery.perPage,
        }),
        client.attendeeAttachedTask.count({
          where: {
            status: TaskStatus.toString(),
          },
        }),
      ])
      return {
        data: attendeeAttachedTaskModels.map(AttendeeAttachedTaskModelToEntity),
        pageResponse: {
          currentPage: PageQuery.page,
          allDataCount: total,
          allPageCount: Math.ceil(total / PageQuery.perPage),
          perPage: PageQuery.perPage,
        },
      }
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
