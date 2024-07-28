import { TeamDeletePairUsecase } from './TeamDeletePairUsecase'
import {
  teamQueryServiceMockSuccess,
  teamQueryServiceMockNotFound,
  teamQueryServiceMockError,
  pairQueryServiceMockSuccess,
  pairQueryServiceMockNotFound,
  pairQueryServiceMockError,
} from '../mock/MockQuery'
import {
  teamRepositoryMockSuccess,
  teamRepositoryMockError,
} from '../mock/MockRepository'
import { TeamMockDataA, PairMockData1 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { Team } from '../entity/Team'

describe('TeamDeletePairUsecase', () => {
  const allSuccessUsecase = new TeamDeletePairUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
  )

  const teamNotFoundUsecase = new TeamDeletePairUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockNotFound,
    pairQueryServiceMockSuccess,
  )

  const teamQueryErrorUsecase = new TeamDeletePairUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockError,
    pairQueryServiceMockSuccess,
  )

  const pairNotFoundUsecase = new TeamDeletePairUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockNotFound,
  )

  const pairQueryErrorUsecase = new TeamDeletePairUsecase(
    teamRepositoryMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockError,
  )

  const teamRepositoryErrorUsecase = new TeamDeletePairUsecase(
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
    test('正常系: ペアをチームから削除成功', async () => {
      const mockTeam = TeamMockDataA
      jest.spyOn(mockTeam, 'deletePair').mockReturnValue(mockTeam)
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamById')
        .mockResolvedValue(mockTeam)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(PairMockData1)

      const result = await allSuccessUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toBeInstanceOf(Team)
      expect(mockTeam.deletePair).toHaveBeenCalled()
    })

    test('チームが見つからない場合', async () => {
      const result = await teamNotFoundUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toEqual(
        new InvalidParameterError('指定されたチームは存在しません。'),
      )
    })

    test('チームクエリでエラーが発生した場合', async () => {
      const result = await teamQueryErrorUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('ペアが見つからない場合', async () => {
      const result = await pairNotFoundUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toEqual(
        new InvalidParameterError('指定されたペアは存在しません。'),
      )
    })

    test('ペアクエリでエラーが発生した場合', async () => {
      const result = await pairQueryErrorUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('チームの保存でエラーが発生した場合', async () => {
      const mockTeam = TeamMockDataA
      jest.spyOn(mockTeam, 'deletePair').mockReturnValue(mockTeam)
      jest
        .spyOn(teamQueryServiceMockSuccess, 'findTeamById')
        .mockResolvedValue(mockTeam)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(PairMockData1)

      const result = await teamRepositoryErrorUsecase.exec(
        TeamMockDataA.id,
        PairMockData1.id,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
