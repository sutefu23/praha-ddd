import { TaskStatus, StatusConst, StatusEnum } from './TaskStatus'

describe('TaskStatus', () => {
  it('should return new TaskStatus instance', () => {
    const status = TaskStatus.new(StatusConst.NOT_STARTED)
    expect(status).toBeInstanceOf(TaskStatus)
    expect((status as TaskStatus).value).toBe(StatusConst.NOT_STARTED)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    const status = TaskStatus.new('invalid' as StatusEnum)
    expect(status).toBeInstanceOf(Error)
  })
  it('should return TaskStatus instance', () => {
    const status = TaskStatus.mustParse(StatusConst.NOT_STARTED)
    expect(status).toBeInstanceOf(TaskStatus)
    expect(status.value).toBe(StatusConst.NOT_STARTED)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    expect(() => TaskStatus.mustParse('invalid' as StatusEnum)).toThrowError(
      Error,
    )
  })
})
