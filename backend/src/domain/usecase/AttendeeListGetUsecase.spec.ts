import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeListGetUsecase } from './AttendeeListGetUsecase'
import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockError,
} from '../mock/MockQuery'
import { AttendeeMockData1, AttendeeMockData2 } from '../mock/MockData'
import { QueryError } from '../error/DomainError'
import { Attendee } from '../entity/Attendee'

jest.mock('../mock/MockDBClient')

describe('AttendeeListGetUsecase', () => {
  const successUsecase = new AttendeeListGetUsecase(
    repositoryClientMock,
    attendeeQueryServiceMockSuccess,
  )

  const errorUsecase = new AttendeeListGetUsecase(
    repositoryClientMock,
    attendeeQueryServiceMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    test('正常系：参加者リストを取得できる場合', async () => {
      const result = await successUsecase.exec()
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(2)
      expect((result as Attendee[])[0]).toBeInstanceOf(Attendee)
      expect((result as Attendee[])[1]).toBeInstanceOf(Attendee)
      expect(result).toEqual([AttendeeMockData1, AttendeeMockData2])
    })

    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const result = await errorUsecase.exec()
      expect(result).toBeInstanceOf(QueryError)
      expect(result).toEqual(new QueryError('reason'))
    })
  })
})
