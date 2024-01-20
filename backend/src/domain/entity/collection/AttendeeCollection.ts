import { Attendee } from '../Attendee'
import { ImmutableArray } from '../base/Array'

export class AttendeeCollection extends ImmutableArray<Attendee> {
  private attendees: Attendee[]
  constructor(attendees: Attendee[]) {
    super()
    this.attendees = attendees
  }

  add(attendee: Attendee): AttendeeCollection {
    return new AttendeeCollection([...this.attendees, attendee])
  }

  delete(attendee: Attendee): AttendeeCollection {
    const deletedAttendees = this.attendees.filter((a) => !a.equals(attendee))
    return new AttendeeCollection(deletedAttendees)
  }

  has(attendee: Attendee): boolean {
    return this.attendees.some((a) => a.equals(attendee))
  }
}
