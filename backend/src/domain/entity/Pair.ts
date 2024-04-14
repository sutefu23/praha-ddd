import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { UUID } from '../valueObject/UUID'
import { PairName } from '../valueObject/PairName'
import {
  PairAttendeeCollection,
  PairAttendeeTooLessError,
  PairAttendeeTooManyError,
} from './collection/PairAttendeeCollection'

// ペア
export interface PairProps extends EntityProps {
  readonly id: UUID
  readonly name: PairName
  readonly attendees: Attendee[]
}

export interface CreatePairProps {
  readonly name: PairName
  readonly attendees: Attendee[]
}

export class Pair extends BaseEntity<PairProps> {
  private constructor(props: PairProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get name(): PairName {
    return this.props.name
  }

  get attendees(): PairAttendeeCollection {
    return PairAttendeeCollection.regen(this.props.attendees)
  }

  addAttendee(attendee: Attendee) {
    const new_collection = this.attendees.add(attendee)
    if (new_collection instanceof PairAttendeeTooManyError) {
      return new_collection // as PairAttendeeTooManyError
    }
    return new Pair({
      ...this.props,
      attendees: new_collection,
    })
  }

  deleteAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.delete(attendee)
    if (new_attendees instanceof PairAttendeeTooLessError) {
      return new_attendees // as PairAttendeeTooLessError
    }
    return new Pair({
      ...this.props,
      attendees: new_attendees,
    })
  }

  public static create(createProps: CreatePairProps): Pair {
    const id = UUID.new()
    const props: PairProps = {
      id,
      name: createProps.name,
      attendees: createProps.attendees,
    }

    return new Pair(props)
  }

  public static regen(regenProps: PairProps): Pair {
    return new Pair(regenProps)
  }
}

export { PairAttendeeTooManyError }
