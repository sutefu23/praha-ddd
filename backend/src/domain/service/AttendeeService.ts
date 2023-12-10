import { Attendee } from '../entity/Attendee'
import { EnrollmentStatus } from '../valueObject/EnrollmentStatus'

export class AttendeeService {
  constructor(private readonly attendee: Attendee) {}

  public modifyEnrollmentStatus = (
    enrollmentStatus: EnrollmentStatus,
  ): Attendee => {
    return this.attendee.setEnrollmentStatus(enrollmentStatus)
  }
}
