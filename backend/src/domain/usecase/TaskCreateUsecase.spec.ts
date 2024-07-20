import { TaskCreateUsecase } from './TaskCreateUsecase'
import { repositoryClientMock } from '../mock/MockDBClient'
import {
  taskQueryServiceMockSuccess,
  taskQueryServiceMockError,
  taskQueryServiceMockNotFound,
} from '../mock/MockQuery'
import {
  taskRepositoryMockSuccess,
  taskRepositoryMockError,
} from '../mock/MockRepository'
import { TaskMockData1 } from '../mock/MockData'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { Task, CreateTaskProps } from '../entity/Task'

describe('TaskCreateUsecase', () => {
  const successUsecase = new TaskCreateUsecase(
    repositoryClientMock,
    taskRepositoryMockSuccess,
    taskQueryServiceMockNotFound,
  )

  const hasSameTaskUsecase = new TaskCreateUsecase(
    repositoryClientMock,
    taskRepositoryMockSuccess,
    taskQueryServiceMockSuccess,
  )

  const queryErrorUsecase = new TaskCreateUsecase(
    repositoryClientMock,
    taskRepositoryMockSuccess,
    taskQueryServiceMockError,
  )

  const repositoryErrorUsecase = new TaskCreateUsecase(
    repositoryClientMock,
    taskRepositoryMockError,
    taskQueryServiceMockNotFound,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exec', () => {
    const mockTaskProps: CreateTaskProps = {
      content: '課題1',
      taskNumber: 1,
    }

    test('正常系: タスク作成成功', async () => {
      const result = await successUsecase.exec(mockTaskProps)
      expect(result).toBeInstanceOf(Task)
    })

    test('同じタスク番号の課題が既に存在する場合', async () => {
      const result = await hasSameTaskUsecase.exec(mockTaskProps)
      expect(result).toEqual(
        new InvalidParameterError('同じタスク番号の課題が既に存在します。'),
      )
    })

    test('タスククエリでエラーが発生した場合', async () => {
      const mockError = new QueryError('reason')
      const result = await queryErrorUsecase.exec(mockTaskProps)
      expect(result).toBeInstanceOf(QueryError)
      expect(result).toEqual(mockError)
    })

    test('タスクの保存でエラーが発生した場合', async () => {
      jest
        .spyOn(taskQueryServiceMockSuccess, 'findTaskByTaskNumber')
        .mockResolvedValue(null)
      Task.create = jest.fn().mockReturnValue(TaskMockData1)

      const result = await repositoryErrorUsecase.exec(mockTaskProps)
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
