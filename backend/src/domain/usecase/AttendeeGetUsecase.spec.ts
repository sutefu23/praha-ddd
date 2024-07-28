import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeCreateUsecase } from './AttendeeCreateUsecase'
import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockError,
  attendeeQueryServiceMockNotFound,
} from '../mock/MockQuery'
import {
  attendeeRepositoryMockSuccess,
  attendeeRepositoryMockError,
} from '../mock/MockRepository'
import {
  QueryError,
  InvalidParameterError,
  RepositoryError,
} from '../error/DomainError'
import { Attendee, CreateAttendeeProps } from '../entity/Attendee'

jest.mock('../mock/MockDBClient')

describe('AttendeeCreateUsecase', () => {
  const validAttendeeProps: CreateAttendeeProps = {
    email: 'test@example.com',
    name: 'Test User',
  }

  const allSuccessUsecase = new AttendeeCreateUsecase(
    attendeeRepositoryMockSuccess,
    attendeeQueryServiceMockNotFound,
  )

  const emailQuerySuccessUsecase = new AttendeeCreateUsecase(
    attendeeRepositoryMockSuccess,
    attendeeQueryServiceMockSuccess,
  )

  const queryErrorUsecase = new AttendeeCreateUsecase(
    attendeeRepositoryMockSuccess,
    attendeeQueryServiceMockError,
  )

  const repositoryErrorUsecase = new AttendeeCreateUsecase(
    attendeeRepositoryMockError,
    attendeeQueryServiceMockNotFound,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    test('正常系', async () => {
      const result = await allSuccessUsecase.exec(validAttendeeProps)
      expect(result).toBeInstanceOf(Attendee)
      expect((result as Attendee).email).toBe(validAttendeeProps.email)
    })

    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const result = await queryErrorUsecase.exec(validAttendeeProps)
      expect(result).toEqual(new QueryError('reason'))
    })

    test('既に同じメールアドレスが存在する場合', async () => {
      const sameMailAttendeeProps: CreateAttendeeProps = {
        email: 'test1@example.com',
        name: 'Test User',
      }
      const result = await emailQuerySuccessUsecase.exec(sameMailAttendeeProps)
      expect(result).toEqual(
        new InvalidParameterError('同じメールの登録者が既に存在します。'),
      )
    })

    test('attendeeRepositoryがエラーを返す場合', async () => {
      const result = await repositoryErrorUsecase.exec(validAttendeeProps)
      expect(result).toEqual(new RepositoryError('reason'))
    })
  })
})
