import { Team } from '@/domain/entity/Team'
import { ITeamRepository } from '@/domain/interface/ITeamRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import type { PrismaClientType } from './db'
export class TeamRepository implements ITeamRepository<PrismaClientType> {
  public async save(
    client: PrismaClientType,
    team: Team,
  ): Promise<void | RepositoryError> {
    try {
      await client.team.upsert({
        where: { id: team.id.toString() },
        update: { name: team.name.value },
        create: {
          id: team.id.toString(),
          name: team.name.value,
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
      await client.team.delete({ where: { id: id.toString() } })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
