import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'
import prisma from './client'

// beforeEach(() => {
//   mockReset(repositoryClientMock)
// })

export type MockClientType = DeepMockProxy<PrismaClient>
export const repositoryClientMock = (prisma as unknown) as MockClientType
