import { AttendeeAttachedTask } from '../entity/AttendeeAttachedTask'
import { QueryError, QueryNotFoundError } from '../error/DomainError'
import { PageQuery } from '../interface/PageQuery'
import { PageResponse } from '../interface/PageResponse'
import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeAttachedTaskMockData1 } from '../mock/MockData'

import {
  attendeeAttachedTaskQueryServiceSuccess,
  attendeeAttachedTaskQueryServiceNotFound,
  attendeeAttachedTaskQueryServiceError,
} from '../mock/MockQuery'
import {
  TaskStatus,
  StatusConst as TaskStatusConst,
} from '../valueObject/TaskStatus'
import { AttendeeAttachedTaskGetUsecase } from './AttendeeAttachedTaskGetUsecase'

describe('AttendeeAttachedTaskAttachCreateUsecase', () => {
  const allSuccesUsecase = new AttendeeAttachedTaskGetUsecase(
    repositoryClientMock,
    attendeeAttachedTaskQueryServiceSuccess,
  )

  const attendeeAttachedTaskQueryErrorUsecase = new AttendeeAttachedTaskGetUsecase(
    repositoryClientMock,
    attendeeAttachedTaskQueryServiceError,
  )

  const attendeeAttachedTaskQueryNullUsecase = new AttendeeAttachedTaskGetUsecase(
    repositoryClientMock,
    attendeeAttachedTaskQueryServiceNotFound,
  )

  const pageQuery = new PageQuery(1, 10)
  it('正常系', async () => {
    const result = (await allSuccesUsecase.exec(
      TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      pageQuery,
    )) as { data: AttendeeAttachedTask[]; pageResponse: PageResponse }
    expect(result.data[0]).toEqual(AttendeeAttachedTaskMockData1)
    expect(result.pageResponse).toBeInstanceOf(PageResponse)
  })

  it('AttendeeAttachedTaskQueryがErrorを返す場合', async () => {
    const result = await attendeeAttachedTaskQueryErrorUsecase.exec(
      TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      pageQuery,
    )
    expect(result).toEqual(new QueryError('reason'))
  })

  it('AttendeeAttachedTaskQueryがnullを返す場合', async () => {
    const result = await attendeeAttachedTaskQueryNullUsecase.exec(
      TaskStatus.mustParse(TaskStatusConst.COMPLETED),
      pageQuery,
    )
    expect(result).toEqual(
      new QueryNotFoundError('指定された課題が存在しません'),
    )
  })
})
