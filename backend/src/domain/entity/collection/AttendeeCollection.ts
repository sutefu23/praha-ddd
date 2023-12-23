import { Attendee } from '../Attendee'
import { BaseArray } from '../base/Array'

export class AttendeeCollection extends BaseArray<Attendee> {
  private attendees: Attendee[]
  private constructor(attendees: Attendee[]) {
    super()

    this.attendees = attendees
  }
  add(attendee: Attendee): AttendeeCollection {
    return new AttendeeCollection([...this.attendees, attendee])
  }
  delete(attendee: Attendee) {
    return new AttendeeCollection([...this.attendees, attendee])
  }
}
