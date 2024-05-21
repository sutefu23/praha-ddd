import { ITransaction } from '@/domain/interface/ITransaction'
import { PrismaClient } from '@prisma/client'
import { TransactionClientType } from './db'
const prisma = new PrismaClient()

export class Transaction implements ITransaction {
  async exec(callback: (tx: TransactionClientType) => void): Promise<void> {
    await prisma.$transaction(async (tx) => {
      callback(tx)
    })
  }
}
