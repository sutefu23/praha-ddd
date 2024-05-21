import { Pair } from '@/domain/entity/Pair'
import { IPairRepository } from '@/domain/interface/IPairRepository'
import { RepositoryError } from '@/domain/error/DomainError'
import { UUID } from '@/domain/valueObject/UUID'
import type { PrismaClientType } from './db'
export class PairRepository implements IPairRepository<PrismaClientType> {
  public async save(
    client: PrismaClientType,
    Pair: Pair,
  ): Promise<void | RepositoryError> {
    try {
      await client.pair.upsert({
        where: { id: Pair.id.toString() },
        update: { name: Pair.name.value },
        create: {
          id: Pair.id.toString(),
          name: Pair.name.value,
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
      await client.pair.delete({ where: { id: id.toString() } })
    } catch (e) {
      if (e instanceof Error) {
        return new RepositoryError(e.message)
      }
    }
  }
}
