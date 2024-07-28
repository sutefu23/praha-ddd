import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeAttachedTaskModifyStatusUsecase } from './AttendeeAttachedTaskModifyStatusUsecase'
import {
  attendeeAttachedTaskQueryServiceSuccess,
  attendeeAttachedTaskQueryServiceNotFound,
  attendeeAttachedTaskQueryServiceError,
} from '../mock/MockQuery'
import {
  attendeeAttachedTaskRepositoryMockSuccess,
  attendeeAttachedTaskRepositoryMockError,
} from '../mock/MockRepository'
import {
  AttendeeMockData1,
  AttendeeMockData2,
  TaskMockData1,
} from '../mock/MockData'
import {
  QueryError,
  QueryNotFoundError,
  RepositoryError,
  UnPemitedOperationError,
  InvalidParameterError,
} from '../error/DomainError'
import {
  TaskStatus,
  StatusConst as TaskStatusConst,
} from '../valueObject/TaskStatus'

jest.mock('../mock/MockDBClient')

describe('AttendeeAttachedTaskModifyStatusUsecase', () => {
  const allSuccessUsecase = new AttendeeAttachedTaskModifyStatusUsecase(
    attendeeAttachedTaskRepositoryMockSuccess,
    attendeeAttachedTaskQueryServiceSuccess,
  )

  const queryErrorUsecase = new AttendeeAttachedTaskModifyStatusUsecase(
    attendeeAttachedTaskRepositoryMockSuccess,
    attendeeAttachedTaskQueryServiceError,
  )

  const queryNotFoundUsecase = new AttendeeAttachedTaskModifyStatusUsecase(
    attendeeAttachedTaskRepositoryMockSuccess,
    attendeeAttachedTaskQueryServiceNotFound,
  )

  const repositoryErrorUsecase = new AttendeeAttachedTaskModifyStatusUsecase(
    attendeeAttachedTaskRepositoryMockError,
    attendeeAttachedTaskQueryServiceSuccess,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    test('正常系', async () => {
      const successResult = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        TaskMockData1.id,
        TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      )
      expect(successResult).toEqual(undefined)
    })

    test('attendeeAttachedTaskQueryServiceがエラーを返す場合', async () => {
      const errorResult = await queryErrorUsecase.exec(
        AttendeeMockData1.id,
        TaskMockData1.id,
        TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      )
      expect(errorResult).toEqual(new QueryError('reason'))
    })

    test('attendeeAttachedTaskQueryServiceがnullを返す場合', async () => {
      const errorResult = await queryNotFoundUsecase.exec(
        AttendeeMockData1.id,
        TaskMockData1.id,
        TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      )
      expect(errorResult).toEqual(
        new QueryNotFoundError('指定された課題が存在しません'),
      )
    })

    test('違う参加者が変更しようとした場合', async () => {
      const errorResult = await allSuccessUsecase.exec(
        AttendeeMockData2.id,
        TaskMockData1.id,
        TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      )
      expect(errorResult).toEqual(
        new UnPemitedOperationError('課題の変更権限がありません'),
      )
    })

    test('attendeeAttachedTaskRepositoryがエラーを返す場合', async () => {
      const errorResult = await repositoryErrorUsecase.exec(
        AttendeeMockData1.id,
        TaskMockData1.id,
        TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      )
      expect(errorResult).toEqual(new RepositoryError('reason'))
    })

    test('無効なステータスが指定された場合', async () => {
      const invalidStatus = ('INVALID_STATUS' as unknown) as TaskStatus
      const errorResult = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        TaskMockData1.id,
        invalidStatus,
      )
      expect(errorResult).toEqual(new InvalidParameterError('不正な値です'))
    })
  })
})
