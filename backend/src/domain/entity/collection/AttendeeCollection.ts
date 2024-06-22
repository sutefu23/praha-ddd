import { Attendee } from '../Attendee'
import { ImmutableArray } from '../base/Array'

export class AttendeeCollection extends ImmutableArray<Attendee> {
  constructor(attendees: Attendee[]) {
    super(attendees)
  }
  static create(attendees: Attendee[]): AttendeeCollection {
    return new AttendeeCollection(attendees)
  }

  static regen(attendees: Attendee[]): AttendeeCollection {
    return new AttendeeCollection(attendees)
  }

  add(attendee: Attendee): AttendeeCollection {
    return new AttendeeCollection([...this, attendee])
  }

  delete(attendee: Attendee): AttendeeCollection {
    const deletedAttendees = this.filter((a) => !a.equals(attendee))
    return new AttendeeCollection(deletedAttendees)
  }

  has(attendee: Attendee): boolean {
    return this.some((a) => a.equals(attendee))
  }
}
