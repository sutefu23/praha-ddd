import { Attendee } from '@/domain/entity/Attendee'
import { IAttendeeRepository } from '@/domain/interface/IAttendeeRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import type { PrismaClientType } from './db'
export class AttendeeRepository
  implements IAttendeeRepository<PrismaClientType> {
  public async save(
    client: PrismaClientType,
    attendee: Attendee,
  ): Promise<void | RepositoryError> {
    try {
      await client.attendee.upsert({
        where: { id: attendee.id.toString() },
        update: { name: attendee.name },
        create: {
          id: attendee.id.toString(),
          name: attendee.name,
          email: attendee.email,
          status: attendee.enrollment_status.value,
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
  public async delete(
    client: PrismaClientType,
    id: UUID,
  ): Promise<void | RepositoryError> {
    try {
      await client.attendee.delete({ where: { id: id.toString() } })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
