import { PairListGetUsecase } from './PairListGetUsecase'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  pairQueryServiceMockSuccess,
  pairQueryServiceMockError,
} from '../mock/MockQuery'
import { PairMockData1, PairMockData2 } from '../mock/MockData'
import { QueryError } from '../error/DomainError'
import { Pair } from '../entity/Pair'
import { PairCollection } from '../entity/collection/PairCollection'

jest.mock('../mock/MockDBClient')

describe('PairListGetUsecase', () => {
  const successUsecase = new PairListGetUsecase(
    repositoryClientMock,
    pairQueryServiceMockSuccess,
  )

  const errorUsecase = new PairListGetUsecase(
    repositoryClientMock,
    pairQueryServiceMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    test('正常系: ペア一覧取得成功', async () => {
      const mockPairs = [PairMockData1, PairMockData2]
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findAllPairs')
        .mockResolvedValue(PairCollection.create(mockPairs))

      const result = await successUsecase.exec()
      const pairs = result as Pair[]
      expect(pairs).toEqual(mockPairs)
      expect(pairs).toHaveLength(2)
      expect(pairs[0]).toBeInstanceOf(Pair)
      expect(pairs[1]).toBeInstanceOf(Pair)
    })

    test('正常系: ペアが存在しない場合', async () => {
      jest
        .spyOn(pairQueryServiceMockSuccess, 'findAllPairs')
        .mockResolvedValue(PairCollection.create([]))

      const result = await successUsecase.exec()
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    test('ペアクエリでエラーが発生した場合', async () => {
      const mockError = new QueryError('エラーが発生しました')
      jest
        .spyOn(pairQueryServiceMockError, 'findAllPairs')
        .mockResolvedValue(mockError)

      const result = await errorUsecase.exec()
      expect(result).toBeInstanceOf(QueryError)
      expect(result).toEqual(mockError)
    })
  })
})
