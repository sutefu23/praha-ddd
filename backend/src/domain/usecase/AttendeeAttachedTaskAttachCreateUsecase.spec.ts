import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeAttachedTaskAttachCreateUsecase } from './AttendeeAttachedTaskAttachCreateUsecase'

import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockNotFound,
  attendeeQueryServiceMockError,
  taskQueryServiceMockSuccess,
  taskQueryServiceMockNotFound,
  taskQueryServiceMockError,
} from '../mock/MockQuery'

import {
  attendeeAttachedTaskRepositoryMockSuccess,
  attendeeAttachedTaskRepositoryMockError,
} from '../mock/MockRepository'
import { AttendeeMockData1 } from '../mock/MockData'
import {
  QueryError,
  QueryNotFoundError,
  RepositoryError,
} from '../error/DomainError'

jest.mock('../mock/MockDBClient')

describe('AttendeeAttachedTaskAttachCreateUsecase', () => {
  const allSuccesUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const taskQueryErrorUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockError,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const taskQueryNullUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockNotFound,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const attendeeQueryErrorUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockSuccess,
    attendeeQueryServiceMockError,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const attendeeNullQueryUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockSuccess,
    attendeeQueryServiceMockNotFound,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const attendeeAttachedTaskRepositoryErrorUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
    repositoryClientMock,
    taskQueryServiceMockSuccess,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    test('正常系', async () => {
      const successResult = await allSuccesUsecase.exec(1, AttendeeMockData1.id)
      expect(successResult).toEqual(undefined)
    })
    test('taskQueryServiceがエラーを返す場合', async () => {
      const errorResult = await taskQueryErrorUsecase.exec(
        1,
        AttendeeMockData1.id,
      )
      expect(errorResult).toEqual(new QueryError('reason'))
    })
    test('taskQueryServiceがnullを返す場合', async () => {
      const errorResult = await taskQueryNullUsecase.exec(
        1,
        AttendeeMockData1.id,
      )
      expect(errorResult).toEqual(
        new QueryNotFoundError('指定された課題が存在しません'),
      )
    })
    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const errorResult = await attendeeQueryErrorUsecase.exec(
        1,
        AttendeeMockData1.id,
      )
      expect(errorResult).toEqual(new QueryError('reason'))
    })
    test('attendeeQueryServiceがnullを返す場合', async () => {
      const errorResult = await attendeeNullQueryUsecase.exec(
        1,
        AttendeeMockData1.id,
      )
      expect(errorResult).toEqual(
        new QueryNotFoundError('指定された参加者が存在しません'),
      )
    })
    test('attendeeAttachedTaskRepositoryがエラーを返す場合', async () => {
      const errorResult = await attendeeAttachedTaskRepositoryErrorUsecase.exec(
        1,
        AttendeeMockData1.id,
      )
      expect(errorResult).toEqual(new RepositoryError('reason'))
    })
  })
})
