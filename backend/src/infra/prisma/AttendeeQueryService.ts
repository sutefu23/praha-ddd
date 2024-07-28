import { Attendee } from '@/domain/entity/Attendee'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import { Attendee as AttendeeModel } from '@prisma/client'
import { IAttendeeQueryService } from '@/domain/interface/IAttendeeQueryService'
import { EnrollmentStatus } from '@/domain/valueObject/EnrollmentStatus'

export class AttendeeQueryService implements IAttendeeQueryService {
  constructor(public readonly client: PrismaClientType) {}
  public async findAttendeeById(
    id: UUID,
  ): Promise<Attendee | QueryError | null> {
    try {
      const dbAttendeeModel = await this.client.attendee.findUnique({
        where: { id: id.toString() },
      })
      if (dbAttendeeModel === null) {
        return null
      }
      return AttendeeModelToEntity(dbAttendeeModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findAttendeeByEmail(
    email: string,
  ): Promise<Attendee | QueryError | null> {
    try {
      const dbAttendeeModel = await this.client.attendee.findFirst({
        where: { email: email },
      })
      if (dbAttendeeModel === null) {
        return null
      }
      return AttendeeModelToEntity(dbAttendeeModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findAttendeesByTeamId(
    teamId: string,
  ): Promise<QueryError | Attendee[]> {
    try {
      const attendeeModel = await this.client.attendee.findMany({
        where: {
          PairAttendeeList: {
            some: {
              pair: {
                TeamPairList: {
                  some: {
                    teamId: teamId,
                  },
                },
              },
            },
          },
        },
        include: {
          PairAttendeeList: true,
          AttendeeAttachedTask: true,
        },
      })
      return attendeeModel.map((dbAttendee) =>
        AttendeeModelToEntity(dbAttendee),
      )
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return []
  }
  public async findAllAttendees(): Promise<QueryError | Attendee[]> {
    try {
      const attendeeModel = await this.client.attendee.findMany({
        include: {
          PairAttendeeList: true,
          AttendeeAttachedTask: true,
        },
      })
      return attendeeModel.map((dbAttendee) =>
        AttendeeModelToEntity(dbAttendee),
      )
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return []
  }
  public async findAttendeesByIds(
    ids: UUID[],
  ): Promise<QueryError | Attendee[]> {
    try {
      const attendeeModel = await this.client.attendee.findMany({
        where: {
          id: {
            in: ids.map((id) => id.toString()),
          },
        },
        include: {
          PairAttendeeList: true,
          AttendeeAttachedTask: true,
        },
      })
      return attendeeModel.map((dbAttendee) =>
        AttendeeModelToEntity(dbAttendee),
      )
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return []
  }
}

export function AttendeeModelToEntity(dbAttendee: AttendeeModel): Attendee {
  return Attendee.regen({
    id: UUID.mustParse(dbAttendee.id),
    name: dbAttendee.name,
    email: dbAttendee.email,
    enrollment_status: EnrollmentStatus.mustParse(dbAttendee.status),
  })
}
