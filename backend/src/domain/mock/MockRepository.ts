import { IAttendeeAttachedTaskRepository } from '@/domain/interface/IAttendeeAttachedTaskRepository'
import { RepositoryError } from '../error/DomainError'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'
import { AttendeeMockData1 } from './MockData'
import { ITaskRepository } from '../interface/ITaskRepository'
import { IPairRepository } from '../interface/IPairRepository'
import { ITeamRepository } from '../interface/ITeamRepository'
export const attendeeAttachedTaskRepositoryMockSuccess: IAttendeeAttachedTaskRepository = {
  save: jest.fn().mockResolvedValue(undefined),
}

export const attendeeAttachedTaskRepositoryMockError: IAttendeeAttachedTaskRepository = {
  save: jest.fn().mockResolvedValue(new RepositoryError('reason')),
}

export const attendeeRepositoryMockSuccess: IAttendeeRepository = {
  save: jest.fn().mockResolvedValue(AttendeeMockData1),
  delete: jest.fn().mockResolvedValue(undefined),
}

export const attendeeRepositoryMockError: IAttendeeRepository = {
  save: jest.fn().mockResolvedValue(new RepositoryError('reason')),
  delete: jest.fn().mockResolvedValue(new RepositoryError('reason')),
}

export const attendeeRepositoryMockNotFound: IAttendeeRepository = {
  save: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(null),
}

export const taskRepositoryMockSuccess: ITaskRepository = {
  save: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  bulkSave: jest.fn().mockResolvedValue(undefined),
}

export const taskRepositoryMockError: ITaskRepository = {
  save: jest.fn().mockResolvedValue(new RepositoryError('reason')),
  delete: jest.fn().mockResolvedValue(new RepositoryError('reason')),
  bulkSave: jest.fn().mockResolvedValue(new RepositoryError('reason')),
}

export const pairRepositoryMockSuccess: IPairRepository = {
  save: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
}

export const pairRepositoryMockError: IPairRepository = {
  save: jest.fn().mockResolvedValue(new RepositoryError('reason')),
  delete: jest.fn().mockResolvedValue(new RepositoryError('reason')),
}

export const teamRepositoryMockSuccess: ITeamRepository = {
  save: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
}

export const teamRepositoryMockError: ITeamRepository = {
  save: jest.fn().mockResolvedValue(new RepositoryError('reason')),
  delete: jest.fn().mockResolvedValue(new RepositoryError('reason')),
}
