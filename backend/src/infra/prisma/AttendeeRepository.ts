import { Attendee } from '@/domain/entity/Attendee'
import { IAttendeeRepository } from '@/domain/interface/IAttendeeRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import type { PrismaClientType } from './db'
export class AttendeeRepository implements IAttendeeRepository {
  constructor(public readonly client: PrismaClientType) {}
  public async save(attendee: Attendee): Promise<void | RepositoryError> {
    try {
      await this.client.attendee.upsert({
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
  public async delete(id: UUID): Promise<void | RepositoryError> {
    try {
      await this.client.attendee.delete({ where: { id: id.toString() } })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
