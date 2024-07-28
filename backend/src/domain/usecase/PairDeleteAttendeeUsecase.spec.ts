import { PairDeleteAttendeeUsecase } from './PairDeleteAttendeeUsecase'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  pairQueryServiceMockSuccess,
  pairQueryServiceMockNotFound,
  pairQueryServiceMockError,
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockNotFound,
  attendeeQueryServiceMockError,
} from '../mock/MockQuery'
import {
  pairRepositoryMockSuccess,
  pairRepositoryMockError,
} from '../mock/MockRepository'
import { PairMockData1, AttendeeMockData1 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { Pair } from '../entity/Pair'
import { PairAttendeeTooLessError } from '../entity/collection/PairAttendeeCollection'

describe('PairDeleteAttendeeUsecase', () => {
  const allSuccessUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
  )

  const pairNotFoundUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockNotFound,
    attendeeQueryServiceMockSuccess,
  )

  const pairQueryErrorUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockError,
    attendeeQueryServiceMockSuccess,
  )

  const attendeeNotFoundUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockNotFound,
  )

  const attendeeQueryErrorUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockError,
  )

  const pairRepositoryErrorUsecase = new PairDeleteAttendeeUsecase(
    pairRepositoryMockError,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('exec', () => {
    test('正常系: 参加者をペアから削除成功', async () => {
      const mockPair = PairMockData1
      mockPair.deleteAttendee = jest.fn().mockReturnValue(mockPair)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(mockPair)

      const result = await allSuccessUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(Pair)
      expect(mockPair.deleteAttendee).toHaveBeenCalled()
    })

    test('ペアが見つからない場合', async () => {
      const result = await pairNotFoundUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toEqual(
        new InvalidParameterError('指定されたペアは存在しません。'),
      )
    })

    test('ペアクエリでエラーが発生した場合', async () => {
      const result = await pairQueryErrorUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('参加者が見つからない場合', async () => {
      const result = await attendeeNotFoundUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toEqual(
        new InvalidParameterError('指定された参加者は存在しません。'),
      )
    })

    test('参加者クエリでエラーが発生した場合', async () => {
      const result = await attendeeQueryErrorUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('ペアから参加者を削除できない場合', async () => {
      const mockPair = PairMockData1
      mockPair.deleteAttendee = jest
        .fn()
        .mockReturnValue(
          new PairAttendeeTooLessError('ペアの参加者が少なすぎます。'),
        )
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(mockPair)

      const result = await allSuccessUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(PairAttendeeTooLessError)
    })

    test('ペアの保存でエラーが発生した場合', async () => {
      const mockPair = PairMockData1
      mockPair.deleteAttendee = jest.fn().mockReturnValue(mockPair)
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(mockPair)

      const result = await pairRepositoryErrorUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
