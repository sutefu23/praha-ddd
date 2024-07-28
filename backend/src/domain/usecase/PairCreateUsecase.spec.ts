import { PairCreateUsecase } from './PairCreateUsecase'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  pairQueryServiceMockSuccess,
  pairQueryServiceMockError,
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockError,
  pairQueryServiceMockNotFound,
} from '../mock/MockQuery'
import {
  pairRepositoryMockSuccess,
  pairRepositoryMockError,
} from '../mock/MockRepository'
import { AttendeeMockData1, AttendeeMockData2 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { Pair } from '../entity/Pair'
import { PairName } from '../valueObject/PairName'
import {
  PairAttendeeCollection,
  PairAttendeeTooManyError,
} from '../entity/collection/PairAttendeeCollection'

describe('PairCreateUsecase', () => {
  const allSuccessUsecase = new PairCreateUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockNotFound,
    attendeeQueryServiceMockSuccess,
  )

  const samePairAlreadyExistUsecase = new PairCreateUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
  )

  const pairQueryErrorUsecase = new PairCreateUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockError,
    attendeeQueryServiceMockSuccess,
  )

  const attendeeQueryErrorUsecase = new PairCreateUsecase(
    pairRepositoryMockSuccess,
    pairQueryServiceMockNotFound,
    attendeeQueryServiceMockError,
  )

  const pairRepositoryErrorUsecase = new PairCreateUsecase(
    pairRepositoryMockError,
    pairQueryServiceMockNotFound,
    attendeeQueryServiceMockSuccess,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('exec', () => {
    const mockPairName = PairName.mustParse('A')
    const attendeeIds = [AttendeeMockData1.id, AttendeeMockData2.id]

    test('正常系: ペア作成成功', async () => {
      const result = await allSuccessUsecase.exec(mockPairName, attendeeIds)
      expect(result).toBeInstanceOf(Pair)
    })

    test('同じ名前のペアが既に存在する場合', async () => {
      const result = await samePairAlreadyExistUsecase.exec(
        mockPairName,
        attendeeIds,
      )
      expect(result).toEqual(
        new InvalidParameterError('同じ名前のペアが既に存在します。'),
      )
    })

    test('ペアクエリでエラーが発生した場合', async () => {
      const result = await pairQueryErrorUsecase.exec(mockPairName, attendeeIds)
      expect(result).toBeInstanceOf(QueryError)
    })

    test('参加者クエリでエラーが発生した場合', async () => {
      const result = await attendeeQueryErrorUsecase.exec(
        mockPairName,
        attendeeIds,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('PairAttendeeCollection作成でエラーが発生した場合', async () => {
      jest.mock('../entity/collection/PairAttendeeCollection')
      jest
        .spyOn(PairAttendeeCollection, 'create')
        .mockReturnValue(new PairAttendeeTooManyError('エラー'))

      const result = await allSuccessUsecase.exec(mockPairName, attendeeIds)
      expect(result).toBeInstanceOf(PairAttendeeTooManyError)
    })

    test('Pair作成でエラーが発生した場合', async () => {
      jest
        .spyOn(Pair, 'create')
        .mockReturnValue(new UnPemitedOperationError('エラー'))

      const result = await allSuccessUsecase.exec(mockPairName, attendeeIds)
      expect(result).toBeInstanceOf(UnPemitedOperationError)
    })

    test('ペアの保存でエラーが発生した場合', async () => {
      const result = await pairRepositoryErrorUsecase.exec(
        mockPairName,
        attendeeIds,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
