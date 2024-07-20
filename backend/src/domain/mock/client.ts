import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'jest-mock-extended'

const prisma = new PrismaClient()
export default prisma

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))
