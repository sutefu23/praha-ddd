import { UnPemitedOperationError } from '../../error/DomainError'
import { Attendee } from '../Attendee'
import { AttendeeCollection } from './../collection/AttendeeCollection'

// UnPemitedOperationErrorのサブクラス
export class PairAttendeeTooManyError extends UnPemitedOperationError {
  constructor(message: string) {
    super(message)
    this.name = 'PairAttendeeTooManyError'
  }
}
// UnPemitedOperationErrorのサブクラス
export class PairAttendeeTooLessError extends UnPemitedOperationError {
  constructor(message: string) {
    super(message)
    this.name = 'PairAttendeeTooLessError'
  }
}

export class PairAttendeeCollection extends AttendeeCollection {
  private constructor(attendees: Attendee[]) {
    super(attendees)
  }

  static create(
    attendees: Attendee[],
  ): PairAttendeeCollection | PairAttendeeTooManyError {
    if (attendees.length > 4) {
      return new PairAttendeeTooManyError('4人以下のペアは作成できません')
    }
    return new PairAttendeeCollection(attendees)
  }

  static regen(attendees: Attendee[]): PairAttendeeCollection {
    return new PairAttendeeCollection(attendees)
  }

  add(attendee: Attendee): PairAttendeeCollection | PairAttendeeTooManyError {
    const new_attendees = [...this.attendees, attendee]
    return PairAttendeeCollection.create(new_attendees)
  }

  delete(
    attendee: Attendee,
  ): PairAttendeeCollection | PairAttendeeTooLessError {
    const new_attendees = this.attendees.filter((a) => !a.equals(attendee))
    if (new_attendees.length <= 1) {
      return new PairAttendeeTooLessError('1人以下のペアは作成できません')
    }
    return new PairAttendeeCollection(new_attendees)
  }
}
