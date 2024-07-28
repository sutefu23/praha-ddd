import { TeamDeletePairUsecase } from './TeamDeletePairUsecase'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { IPairQueryService } from '../interface/IPairQueryService'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { ITeamRepository } from '../interface/ITeamRepository'
import { PairMockData1, TeamMockDataA } from '../mock/MockData'

describe('TeamDeletePairUsecase', () => {
  let teamDeletePairUsecase: TeamDeletePairUsecase
  let mockTeamRepository: jest.Mocked<ITeamRepository>
  let mockTeamQueryService: jest.Mocked<ITeamQueryService>
  let mockPairQueryService: jest.Mocked<IPairQueryService>

  beforeEach(() => {
    mockTeamRepository = {
      save: jest.fn(),
    } as any
    mockTeamQueryService = {
      findTeamById: jest.fn(),
    } as any
    mockPairQueryService = {
      findPairById: jest.fn(),
    } as any

    teamDeletePairUsecase = new TeamDeletePairUsecase(
      mockTeamRepository,
      mockTeamQueryService,
      mockPairQueryService,
    )
  })

  it('should delete pair from team successfully', async () => {
    const mockTeam = {
      deletePair: jest.fn().mockReturnValue({ id: 'newTeamId' }),
    } as any
    const mockPair = { id: PairMockData1.id } as any

    jest.spyOn(mockTeamQueryService, 'findTeamById').mockResolvedValue(mockTeam)
    jest.spyOn(mockPairQueryService, 'findPairById').mockResolvedValue(mockPair)
    jest.spyOn(mockTeamRepository, 'save').mockResolvedValue(undefined)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(mockTeamQueryService.findTeamById).toHaveBeenCalledWith(
      TeamMockDataA.id,
    )
    expect(mockPairQueryService.findPairById).toHaveBeenCalledWith(
      PairMockData1.id,
    )
    expect(mockTeam.deletePair).toHaveBeenCalledWith(mockPair)
    expect(mockTeamRepository.save).toHaveBeenCalledWith({
      id: 'newTeamId',
    })
    expect(result).toEqual({ id: 'newTeamId' })
  })

  it('should return InvalidParameterError when team is not found', async () => {
    jest.spyOn(mockTeamQueryService, 'findTeamById').mockResolvedValue(null)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(result).toBeInstanceOf(InvalidParameterError)
    expect((result as InvalidParameterError).message).toBe(
      '指定されたチームは存在しません。',
    )
  })

  it('should return InvalidParameterError when pair is not found', async () => {
    const mockTeam = {} as any
    jest.spyOn(mockTeamQueryService, 'findTeamById').mockResolvedValue(mockTeam)
    jest.spyOn(mockPairQueryService, 'findPairById').mockResolvedValue(null)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(result).toBeInstanceOf(InvalidParameterError)
    expect((result as InvalidParameterError).message).toBe(
      '指定されたペアは存在しません。',
    )
  })

  it('should return QueryError when findTeamById fails', async () => {
    const mockError = new QueryError('Team query failed')
    jest
      .spyOn(mockTeamQueryService, 'findTeamById')
      .mockResolvedValue(mockError)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(result).toBe(mockError)
  })

  it('should return QueryError when findPairById fails', async () => {
    const mockTeam = {} as any
    const mockError = new QueryError('Pair query failed')
    jest.spyOn(mockTeamQueryService, 'findTeamById').mockResolvedValue(mockTeam)
    jest
      .spyOn(mockPairQueryService, 'findPairById')
      .mockResolvedValue(mockError)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(result).toBe(mockError)
  })

  it('should return RepositoryError when save fails', async () => {
    const mockTeam = {
      deletePair: jest.fn().mockReturnValue({ id: 'newTeamId' }),
    } as any
    const mockPair = { id: PairMockData1.id } as any
    const mockError = new RepositoryError('Save failed')

    jest.spyOn(mockTeamQueryService, 'findTeamById').mockResolvedValue(mockTeam)
    jest.spyOn(mockPairQueryService, 'findPairById').mockResolvedValue(mockPair)
    jest.spyOn(mockTeamRepository, 'save').mockResolvedValue(mockError)

    const result = await teamDeletePairUsecase.exec(
      TeamMockDataA.id,
      PairMockData1.id,
    )

    expect(result).toBe(mockError)
  })
})
