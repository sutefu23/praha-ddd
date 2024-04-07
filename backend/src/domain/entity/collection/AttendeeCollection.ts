import { Attendee } from '../Attendee'
import { ImmutableArray } from '../base/Array'

export class AttendeeCollection extends ImmutableArray<Attendee> {
  protected attendees: Attendee[]
  protected constructor(attendees: Attendee[]) {
    super()
    this.attendees = attendees
  }
  static create(attendees: Attendee[]): AttendeeCollection | Error {
    return new AttendeeCollection(attendees)
  }

  static regen(attendees: Attendee[]): AttendeeCollection {
    return new AttendeeCollection(attendees)
  }

  add(attendee: Attendee): AttendeeCollection | Error {
    return new AttendeeCollection([...this.attendees, attendee])
  }

  delete(attendee: Attendee): AttendeeCollection | Error {
    const deletedAttendees = this.attendees.filter((a) => !a.equals(attendee))
    return new AttendeeCollection(deletedAttendees)
  }

  has(attendee: Attendee): boolean {
    return this.attendees.some((a) => a.equals(attendee))
  }
}
