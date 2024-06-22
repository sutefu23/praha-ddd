import { InvalidParameterError } from '../error/DomainError'
import {
  EnrollmentStatus,
  StatusEnum as EnrollmentStatusEnum,
  StatusConst as EnrollmentStatusConst,
} from '../valueObject/EnrollmentStatus'

describe('EnrollmentStatus', () => {
  describe('new', () => {
    it('should return new EnrollmentStatus instance', () => {
      const status = EnrollmentStatus.new(EnrollmentStatusConst.ENROLLMENT)
      expect(status).toBeInstanceOf(EnrollmentStatus)
      expect((status as EnrollmentStatus).value).toBe(
        EnrollmentStatusConst.ENROLLMENT,
      )
    })
    it('should return InvalidParameterError when invalid value is passed', () => {
      const status = EnrollmentStatus.new(
        'invalid' as EnrollmentStatusEnum,
      ) as InvalidParameterError
      expect(status).toBeInstanceOf(Error)
      expect(status.name).toBe(InvalidParameterError.name)
    })
  })
  describe('mustParse', () => {
    it('should return EnrollmentStatus instance', () => {
      const status = EnrollmentStatus.mustParse(
        EnrollmentStatusConst.ENROLLMENT,
      )
      expect(status).toBeInstanceOf(EnrollmentStatus)
      expect(status.value).toBe(EnrollmentStatusConst.ENROLLMENT)
    })
    it('should return InvalidParameterError when invalid value is passed', () => {
      expect(() =>
        EnrollmentStatus.mustParse('invalid' as EnrollmentStatusEnum),
      ).toThrowError(Error)
    })
  })
})
