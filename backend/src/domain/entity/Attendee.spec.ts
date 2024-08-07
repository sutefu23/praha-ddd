import { InvalidParameterError } from '../error/DomainError'
import {
  EnrollmentStatus,
  StatusConst as EnrollmentStatusConst,
} from '../valueObject/EnrollmentStatus'
import { UUID } from '../valueObject/UUID'
import { Attendee } from './Attendee'

describe('Attendee', () => {
  it('should return new Attendee instance', () => {
    const attendee = Attendee.create({
      name: '田中太郎',
      email: 'tanaka@example.com',
    }) as Attendee
    expect(attendee).toBeInstanceOf(Attendee)
    expect(attendee.enrollment_status.value).toBe(
      EnrollmentStatusConst.ENROLLMENT,
    )
  })
  it('should return new Attendee instance', () => {
    const attendee = Attendee.regen({
      id: UUID.mustParse('123e4567-e89b-12d3-a456-426614174000'),
      name: '佐藤次郎',
      email: 'satou@example.com',
      enrollment_status: EnrollmentStatus.mustParse(
        EnrollmentStatusConst.ENROLLMENT,
      ),
    })
    expect(attendee).toBeInstanceOf(Attendee)
  })
  it('should update name', () => {
    const attendee = Attendee.create({
      name: '田中太郎',
      email: 'tanaka@example.com',
    }) as Attendee
    const newAttendee = attendee.setName('田中花子')
    expect(newAttendee.name).toBe('田中花子')
  })
  it('should update enrollment status', () => {
    const attendee = Attendee.create({
      name: '田中太郎',
      email: 'tanaka@example.com',
    }) as Attendee
    const newAttendee = attendee.setEnrollmentStatus(
      EnrollmentStatus.mustParse(EnrollmentStatusConst.WITHDRAWAL),
    )
    expect(newAttendee.enrollment_status.value).toBe(
      EnrollmentStatusConst.WITHDRAWAL,
    )
  })

  it('should return InvalidParameterError', () => {
    const attendee = Attendee.create({
      name: '',
      email: 'test@test.com',
    }) as Attendee
    expect(attendee).toBeInstanceOf(InvalidParameterError)
  })

  it('should return InvalidParameterError', () => {
    const attendee = Attendee.create({
      name: 'test',
      email: 'test',
    }) as Attendee
    expect(attendee).toBeInstanceOf(InvalidParameterError)
  })
})
