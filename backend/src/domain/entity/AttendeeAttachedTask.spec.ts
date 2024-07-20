import { TaskStatus, StatusConst } from '../valueObject/TaskStatus'
import { InvalidParameterError } from '../error/DomainError'
import { AttendeeAttachedTask } from './AttendeeAttachedTask'
import { AttendeeMockData1, TaskMockData1 } from '../mock/MockData'
import { UUID } from '../valueObject/UUID'
describe('AttendeeAttachedTask', () => {
  it('参加者所有課題を作成できる', () => {
    const attendee = AttendeeMockData1
    const task = TaskMockData1
    const attendeeAttachedTask = AttendeeAttachedTask.create({
      attendee,
      task,
    })
    expect(attendeeAttachedTask).toBeInstanceOf(AttendeeAttachedTask)
  })
  it('参加者所有課題のステータスを変更できる', () => {
    const attendee = AttendeeMockData1
    const task = TaskMockData1
    const attendeeAttachedTask = AttendeeAttachedTask.create({
      attendee,
      task,
    })
    const newStatus = TaskStatus.mustParse(StatusConst.COMPLETED)
    const modifiedAttendeeAttachedTask = attendeeAttachedTask.modifyStatus(
      newStatus,
    )
    expect(modifiedAttendeeAttachedTask).toBeInstanceOf(AttendeeAttachedTask)
  })
  it('ステータスが不正な値を指定するとエラーが返る', () => {
    const attendee = AttendeeMockData1
    const task = TaskMockData1
    const attendeeAttachedTask = AttendeeAttachedTask.create({
      attendee,
      task,
    })
    const invalidStatus = ('INVALID_STATUS' as unknown) as TaskStatus
    const modifiedAttendeeAttachedTask = attendeeAttachedTask.modifyStatus(
      invalidStatus,
    )
    expect((modifiedAttendeeAttachedTask as InvalidParameterError).name).toBe(
      InvalidParameterError.name,
    )
  })
  it('ステータスに変更がない場合はエラーが返る', () => {
    const attendee = AttendeeMockData1
    const task = TaskMockData1
    const attendeeAttachedTask = AttendeeAttachedTask.create({
      attendee,
      task,
    })
    const newStatus = TaskStatus.mustParse(StatusConst.NOT_STARTED)
    const modifiedAttendeeAttachedTask = attendeeAttachedTask.modifyStatus(
      newStatus,
    )
    expect(modifiedAttendeeAttachedTask).toBeInstanceOf(Error)
    expect((modifiedAttendeeAttachedTask as InvalidParameterError).name).toBe(
      InvalidParameterError.name,
    )
  })
  it('完了済みの課題のステータスを変更しようとするとエラーが返る', () => {
    const attendee = AttendeeMockData1
    const task = TaskMockData1
    const completedTask = AttendeeAttachedTask.regen({
      id: UUID.new(),
      attendee,
      task,
      status: TaskStatus.mustParse(StatusConst.COMPLETED),
    })
    const newStatus = TaskStatus.mustParse(StatusConst.REVIEW_PENDING)
    const modifiedAttendeeAttachedTask = completedTask.modifyStatus(newStatus)
    expect(modifiedAttendeeAttachedTask).toBeInstanceOf(Error)
    expect((modifiedAttendeeAttachedTask as InvalidParameterError).name).toBe(
      InvalidParameterError.name,
    )
  })
})
