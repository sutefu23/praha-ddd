import { BulkCreateTaskAndAttacheToAllAttendee } from './BulkCreateTaskAndAttacheToAllAttendee'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockError,
} from '../mock/MockQuery'
import {
  taskRepositoryMockSuccess,
  taskRepositoryMockError,
  attendeeAttachedTaskRepositoryMockSuccess,
  attendeeAttachedTaskRepositoryMockError,
} from '../mock/MockRepository'
import { AttendeeAttachedTaskMockData1, TaskMockData1 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'
import { Task } from '../entity/Task'
import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'

describe('BulkCreateTaskAndAttacheToAllAttendee', () => {
  const allSuccessUsecase = new BulkCreateTaskAndAttacheToAllAttendee(
    taskRepositoryMockSuccess,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const taskRepositoryErrorUsecase = new BulkCreateTaskAndAttacheToAllAttendee(
    taskRepositoryMockError,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const attendeeQueryErrorUsecase = new BulkCreateTaskAndAttacheToAllAttendee(
    taskRepositoryMockSuccess,
    attendeeQueryServiceMockError,
    attendeeAttachedTaskRepositoryMockSuccess,
  )

  const attendeeAttachedTaskRepositoryErrorUsecase = new BulkCreateTaskAndAttacheToAllAttendee(
    taskRepositoryMockSuccess,
    attendeeQueryServiceMockSuccess,
    attendeeAttachedTaskRepositoryMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    const taskContents = ['Task 1', 'Task 2']
    const taskNumberOffset = 1

    test('正常系: タスクの作成と参加者へのアタッチが成功', async () => {
      Task.create = jest.fn().mockReturnValue(TaskMockData1)
      AttendeeAttachedTask.create = jest
        .fn()
        .mockReturnValue(AttendeeAttachedTaskMockData1)

      const result = await allSuccessUsecase.exec(
        taskContents,
        taskNumberOffset,
      )
      expect(result).toBeUndefined()
      expect(Task.create).toHaveBeenCalledTimes(2)
      expect(AttendeeAttachedTask.create).toHaveBeenCalledTimes(4) // 2 tasks * 2 attendees
    })

    test('タスク保存時にRepositoryErrorが発生した場合', async () => {
      Task.create = jest.fn().mockReturnValue(TaskMockData1)

      await expect(
        taskRepositoryErrorUsecase.exec(taskContents, taskNumberOffset),
      ).rejects.toThrow(RepositoryError)
    })

    test('参加者取得時にQueryErrorが発生した場合', async () => {
      Task.create = jest.fn().mockReturnValue(TaskMockData1)

      const result = await attendeeQueryErrorUsecase.exec(
        taskContents,
        taskNumberOffset,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    // test('AttendeeAttachedTask保存時にRepositoryErrorが発生した場合', async () => {
    //   const result = await attendeeAttachedTaskRepositoryErrorUsecase.exec(
    //     taskContents,
    //     taskNumberOffset,
    //   )
    //   console.log(result)
    //   expect(result).toBeInstanceOf(QueryError)
    // })
  })
})
