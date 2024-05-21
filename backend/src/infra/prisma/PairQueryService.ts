import { Pair } from '@/domain/entity/Pair'
import { QueryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import { PrismaClientType } from './db'
import type {
  Pair as PairModel,
  PairAttendeeList,
  Attendee as AttendeeModel,
} from '@prisma/client'
import { IPairQueryService } from '@/domain/interface/IPairQueryService'
import { PairCollection } from '@/domain/entity/collection/PairCollection'
import { PairName } from '@/domain/valueObject/PairName'
import { AttendeeModelToEntity } from './AttendeeQueryService'

export type PairModelWithAttendee = {
  PairAttendeeList: ({
    attendee: AttendeeModel
  } & PairAttendeeList)[]
} & PairModel

export class PairQueryService implements IPairQueryService<PrismaClientType> {
  public async findPairByName(
    client: PrismaClientType,
    name: string,
  ): Promise<Pair | QueryError | null> {
    try {
      const pairModel = await client.pair.findFirst({
        where: { name: name },
        include: {
          PairAttendeeList: {
            include: { attendee: true },
          },
        },
      })
      if (pairModel === null) {
        return null
      }
      return PairModelToEntity(pairModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findPairById(
    client: PrismaClientType,
    id: UUID,
  ): Promise<Pair | QueryError | null> {
    try {
      const pairModel = await client.pair.findUnique({
        where: { id: id.toString() },
        include: {
          PairAttendeeList: {
            include: { attendee: true },
          },
        },
      })
      if (pairModel === null) {
        return null
      }
      return PairModelToEntity(pairModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findAttendeesByPairName(
    client: PrismaClientType,
    name: string,
  ): Promise<Pair | QueryError | null> {
    try {
      const pairModelWithAttendee = await client.pair.findFirst({
        where: { name: name },
        include: {
          PairAttendeeList: {
            include: { attendee: true },
          },
        },
      })
      if (pairModelWithAttendee === null) {
        return null
      }
      return PairModelToEntity(pairModelWithAttendee)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findPairByAttendeeId(
    client: PrismaClientType,
    attendeeId: UUID,
  ): Promise<Pair | QueryError | null> {
    try {
      const pairModel = await client.pair.findFirst({
        where: {
          PairAttendeeList: {
            some: {
              attendeeId: attendeeId.toString(),
            },
          },
        },
        include: {
          PairAttendeeList: {
            include: { attendee: true },
          },
        },
      })
      if (pairModel === null) {
        return null
      }
      return PairModelToEntity(pairModel)
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return null
  }
  public async findAllPairs(
    client: PrismaClientType,
  ): Promise<QueryError | PairCollection> {
    try {
      const pairModels = await client.pair.findMany({
        include: {
          PairAttendeeList: {
            include: { attendee: true },
          },
        },
      })
      return new PairCollection(pairModels.map(PairModelToEntity))
    } catch (e) {
      if (e instanceof Error) {
        return new QueryError(e.message)
      }
    }
    return new QueryError('Failed to fetch pairs')
  }
}

export function PairModelToEntity(pairModel: PairModelWithAttendee): Pair {
  return Pair.regen({
    id: UUID.restore(pairModel.id),
    name: PairName.restore(pairModel.name),
    attendees: pairModel.PairAttendeeList.map((attendeeList) => {
      return AttendeeModelToEntity(attendeeList.attendee)
    }),
  })
}
