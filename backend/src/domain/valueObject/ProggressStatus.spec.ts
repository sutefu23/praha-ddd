import { InvalidParameterError } from '../error/DomainError'
import { ProgressStatus, StatusConst, StatusEnum } from './ProggressStatus'
describe('ProgressStatus', () => {
  it('should return new ProgressStatus instance', () => {
    const status = ProgressStatus.new(StatusConst.NOT_STARTED)
    expect(status).toBeInstanceOf(ProgressStatus)
    expect((status as ProgressStatus).value).toBe(StatusConst.NOT_STARTED)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    const status = ProgressStatus.new(
      'invalid' as StatusEnum,
    ) as InvalidParameterError
    expect(status).toBeInstanceOf(Error)
    expect(status.name).toBe(InvalidParameterError.name)
  })
  it('should return ProgressStatus instance', () => {
    const status = ProgressStatus.mustParse(StatusConst.NOT_STARTED)
    expect(status).toBeInstanceOf(ProgressStatus)
    expect(status.value).toBe(StatusConst.NOT_STARTED)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    expect(() =>
      ProgressStatus.mustParse('invalid' as StatusEnum),
    ).toThrowError(Error)
  })
})
