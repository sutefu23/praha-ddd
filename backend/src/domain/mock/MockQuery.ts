import { IAttendeeQueryService } from '@/domain/interface/IAttendeeQueryService'
import { ITaskQueryService } from '@/domain/interface/ITaskQueryService'
import {
  AttendeeAttachedTaskMockData1,
  AttendeeMockData1,
  AttendeeMockData2,
  PairMockData1,
  TaskMockData1,
  TeamCollectionMockData,
  TeamMockDataA,
} from './MockData'
import { QueryError } from '../error/DomainError'
import { IAttendeeAttachedTaskQueryService } from '../interface/IAttendeeAttachedTaskQueryService'
import { PageResponse } from '../interface/PageResponse'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { TeamCollection } from '../entity/collection/TeamCollection'
import { IPairQueryService } from '../interface/IPairQueryService'
import { PairCollection } from '../entity/collection/PairCollection'
import { repositoryClientMock } from './MockDBClient'

export const attendeeQueryServiceMockSuccess: IAttendeeQueryService = {
  client: repositoryClientMock,
  findAttendeeById: jest.fn().mockResolvedValue(AttendeeMockData1),
  findAttendeeByEmail: jest.fn().mockResolvedValue(AttendeeMockData1),
  findAttendeesByTeamId: jest
    .fn()
    .mockResolvedValue([AttendeeMockData1, AttendeeMockData2]),
  findAllAttendees: jest
    .fn()
    .mockResolvedValue([AttendeeMockData1, AttendeeMockData2]),
  findAttendeesByIds: jest
    .fn()
    .mockResolvedValue([AttendeeMockData1, AttendeeMockData2]),
}

export const attendeeQueryServiceMockNotFound: IAttendeeQueryService = {
  client: repositoryClientMock,
  findAttendeeById: jest.fn().mockResolvedValue(null),
  findAttendeeByEmail: jest.fn().mockResolvedValue(null),
  findAttendeesByTeamId: jest.fn().mockResolvedValue(null),
  findAllAttendees: jest.fn().mockResolvedValue(null),
  findAttendeesByIds: jest.fn().mockResolvedValue(null),
}

export const attendeeQueryServiceMockError: IAttendeeQueryService = {
  client: repositoryClientMock,
  findAttendeeById: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAttendeeByEmail: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAttendeesByTeamId: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAllAttendees: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAttendeesByIds: jest.fn().mockResolvedValue(new QueryError('reason')),
}

export const taskQueryServiceMockSuccess: ITaskQueryService = {
  client: repositoryClientMock,
  findTaskById: jest.fn().mockResolvedValue(TaskMockData1),
  findTaskByTaskNumber: jest.fn().mockResolvedValue(TaskMockData1),
  findTasksByAttendeeId: jest.fn().mockResolvedValue([TaskMockData1]),
}
export const taskQueryServiceMockNotFound: ITaskQueryService = {
  client: repositoryClientMock,
  findTaskById: jest.fn().mockResolvedValue(null),
  findTaskByTaskNumber: jest.fn().mockResolvedValue(null),
  findTasksByAttendeeId: jest.fn().mockResolvedValue([]),
}

export const taskQueryServiceMockError: ITaskQueryService = {
  client: repositoryClientMock,
  findTaskById: jest.fn().mockResolvedValue(new QueryError('reason')),
  findTaskByTaskNumber: jest.fn().mockResolvedValue(new QueryError('reason')),
  findTasksByAttendeeId: jest.fn().mockResolvedValue(new QueryError('reason')),
}

export const attendeeAttachedTaskQueryServiceSuccess: IAttendeeAttachedTaskQueryService = {
  client: repositoryClientMock,
  findByTaskAndAttendeeId: jest
    .fn()
    .mockResolvedValue(AttendeeAttachedTaskMockData1),
  findByTaskStatus: jest.fn().mockResolvedValue({
    data: [AttendeeAttachedTaskMockData1],
    pageResponse: new PageResponse(1, 10, 100, 10),
  }),
}

export const attendeeAttachedTaskQueryServiceNotFound: IAttendeeAttachedTaskQueryService = {
  client: repositoryClientMock,
  findByTaskAndAttendeeId: jest.fn().mockResolvedValue(null),
  findByTaskStatus: jest.fn().mockResolvedValue(null),
}

export const attendeeAttachedTaskQueryServiceError: IAttendeeAttachedTaskQueryService = {
  client: repositoryClientMock,
  findByTaskAndAttendeeId: jest
    .fn()
    .mockResolvedValue(new QueryError('reason')),
  findByTaskStatus: jest.fn().mockResolvedValue(new QueryError('reason')),
}

export const teamQueryServiceMockSuccess: ITeamQueryService = {
  client: repositoryClientMock,
  findTeamById: jest.fn().mockResolvedValue(TeamMockDataA),
  findTeamsByAttendeeId: jest.fn().mockResolvedValue(TeamMockDataA),
  findAllTeams: jest.fn().mockResolvedValue(TeamCollectionMockData),
  findTeamByName: jest.fn().mockResolvedValue(TeamMockDataA),
}

export const teamQueryServiceMockNotFound: ITeamQueryService = {
  client: repositoryClientMock,
  findTeamById: jest.fn().mockResolvedValue(null),
  findTeamsByAttendeeId: jest.fn().mockResolvedValue(null),
  findAllTeams: jest.fn().mockResolvedValue(TeamCollection.create([])),
  findTeamByName: jest.fn().mockResolvedValue(null),
}

export const teamQueryServiceMockError: ITeamQueryService = {
  client: repositoryClientMock,
  findTeamById: jest.fn().mockResolvedValue(new QueryError('reason')),
  findTeamsByAttendeeId: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAllTeams: jest.fn().mockResolvedValue(new QueryError('reason')),
  findTeamByName: jest.fn().mockResolvedValue(new QueryError('reason')),
}

export const pairQueryServiceMockSuccess: IPairQueryService = {
  client: repositoryClientMock,
  findPairByName: jest.fn().mockResolvedValue(PairMockData1),
  findPairById: jest.fn().mockResolvedValue(PairMockData1),
  findAllPairs: jest
    .fn()
    .mockResolvedValue(PairCollection.create([PairMockData1])),
  findPairByAttendeeId: jest.fn().mockResolvedValue(PairMockData1),
  findPairsByPairIds: jest.fn().mockResolvedValue([PairMockData1]),
}

export const pairQueryServiceMockNotFound: IPairQueryService = {
  client: repositoryClientMock,
  findPairByName: jest.fn().mockResolvedValue(null),
  findPairById: jest.fn().mockResolvedValue(null),
  findAllPairs: jest.fn().mockResolvedValue(PairCollection.create([])),
  findPairByAttendeeId: jest.fn().mockResolvedValue(null),
  findPairsByPairIds: jest.fn().mockResolvedValue([]),
}

export const pairQueryServiceMockError: IPairQueryService = {
  client: repositoryClientMock,
  findPairByName: jest.fn().mockResolvedValue(new QueryError('reason')),
  findPairById: jest.fn().mockResolvedValue(new QueryError('reason')),
  findAllPairs: jest.fn().mockResolvedValue(new QueryError('reason')),
  findPairByAttendeeId: jest.fn().mockResolvedValue(new QueryError('reason')),
  findPairsByPairIds: jest.fn().mockResolvedValue(new QueryError('reason')),
}
