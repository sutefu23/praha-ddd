import { PrismaClient } from '@prisma/client'
import * as runtime from '@prisma/client/runtime/library.js'
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export type TransactionClientType = Omit<
  PrismaClient,
  runtime.ITXClientDenyList
>
export type PrismaClientType = PrismaClient | TransactionClientType
