import { PairAddAttendeeUsecase } from './PairAddAttendeeUsecase'
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
import { Pair, PairAttendeeTooManyError } from '../entity/Pair'

describe('PairAddAttendeeUsecase', () => {
  const allSuccessUsecase = new PairAddAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
  )

  const pairNotFoundUsecase = new PairAddAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockNotFound,
    attendeeQueryServiceMockSuccess,
  )

  const pairQueryErrorUsecase = new PairAddAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockError,
    attendeeQueryServiceMockSuccess,
  )

  const attendeeNotFoundUsecase = new PairAddAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockNotFound,
  )

  const attendeeQueryErrorUsecase = new PairAddAttendeeUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockError,
  )

  const pairRepositoryErrorUsecase = new PairAddAttendeeUsecase(
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
    test('正常系: 参加者をペアに追加成功', async () => {
      const result = await allSuccessUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(Pair)
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

    test('ペアに参加者を追加できない場合', async () => {
      const mockPair = PairMockData1

      jest
        .spyOn(mockPair, 'addAttendee')
        .mockReturnValue(
          new PairAttendeeTooManyError('ペアの参加者が多すぎます。'),
        )
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findPairById')
        .mockResolvedValue(mockPair)

      const result = await allSuccessUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(PairAttendeeTooManyError)
    })

    test('ペアの保存でエラーが発生した場合', async () => {
      const result = await pairRepositoryErrorUsecase.exec(
        PairMockData1.id,
        AttendeeMockData1.id,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
