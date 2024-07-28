import { TeamCreateUsecase } from './TeamCreateUsecase'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  teamQueryServiceMockSuccess,
  teamQueryServiceMockError,
  pairQueryServiceMockSuccess,
  pairQueryServiceMockError,
} from '../mock/MockQuery'
import {
  teamRepositoryMockSuccess,
  teamRepositoryMockError,
} from '../mock/MockRepository'
import { TeamMockDataA, PairMockData1, PairMockData2 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { Team } from '../entity/Team'
import { TeamName } from '../valueObject/TeamName'

describe('TeamCreateUsecase', () => {
  const allSuccessUsecase = new TeamCreateUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
  )

  const teamQueryErrorUsecase = new TeamCreateUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockError,
    pairQueryServiceMockSuccess,
  )

  const pairQueryErrorUsecase = new TeamCreateUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockError,
  )

  const teamRepositoryErrorUsecase = new TeamCreateUsecase(
    teamRepositoryMockError,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
  describe('exec', () => {
    const mockTeamName = TeamName.mustParse('A')
    const mockPairIds = [PairMockData1.id, PairMockData2.id]

    test('正常系: チーム作成成功', async () => {
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamByName')
        .mockResolvedValue(null)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairsByPairIds')
        .mockResolvedValue([PairMockData1, PairMockData2])

      jest.spyOn(Team, 'create').mockReturnValue(TeamMockDataA)

      const result = await allSuccessUsecase.exec(mockTeamName, mockPairIds)
      expect(result).toBeInstanceOf(Team)
      expect(Team.create).toHaveBeenCalledWith({
        name: mockTeamName,
        pairs: [PairMockData1, PairMockData2],
      })
    })

    test('同じ名前のチームが既に存在する場合', async () => {
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamByName')
        .mockResolvedValue(TeamMockDataA)

      const result = await allSuccessUsecase.exec(mockTeamName, mockPairIds)
      expect(result).toEqual(
        new InvalidParameterError('同じ名前のチームが既に存在します。'),
      )
    })

    test('チームクエリでエラーが発生した場合', async () => {
      const result = await teamQueryErrorUsecase.exec(mockTeamName, mockPairIds)
      expect(result).toBeInstanceOf(QueryError)
    })

    test('ペアクエリでエラーが発生した場合', async () => {
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamByName')
        .mockResolvedValue(null)

      const result = await pairQueryErrorUsecase.exec(mockTeamName, mockPairIds)
      expect(result).toBeInstanceOf(QueryError)
    })

    test('Team.createでUnPemitedOperationErrorが発生した場合', async () => {
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamByName')
        .mockResolvedValue(null)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairsByPairIds')
        .mockResolvedValue([PairMockData1, PairMockData2])
      const mockError = new UnPemitedOperationError('許可されていない操作です')
      jest.spyOn(Team, 'create').mockReturnValue(mockError)

      const result = await allSuccessUsecase.exec(mockTeamName, mockPairIds)
      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect(result).toEqual(mockError)
    })

    test('チームの保存でエラーが発生した場合', async () => {
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamByName')
        .mockResolvedValue(null)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairsByPairIds')
        .mockResolvedValue([PairMockData1, PairMockData2])
      jest.spyOn(Team, 'create').mockReturnValue(TeamMockDataA)

      const result = await teamRepositoryErrorUsecase.exec(
        mockTeamName,
        mockPairIds,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
