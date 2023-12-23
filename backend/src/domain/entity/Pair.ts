import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { UnPemitedOperationError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { PairName } from '../valueObject/PairName'
import { AttendeeCollection } from './collection/AttendeeCollection'

// ペア
export interface PairProps extends EntityProps {
  readonly id: UUID
  readonly name: PairName
  readonly attendees: AttendeeCollection
}

export interface CreatePairProps {
  readonly name: PairName
  readonly attendees: AttendeeCollection
}

export class Pair extends BaseEntity<PairProps> {
  public constructor(props: PairProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get name(): PairName {
    return this.props.name
  }

  get attendees(): AttendeeCollection {
    return this.props.attendees
  }

  setAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.add(attendee)
    if (new_attendees.length >= 4) {
      throw new UnPemitedOperationError('4人以上のペアは作成できません')
    }

    return Pair.regen({
      ...this.props,
      attendees: new_attendees,
    })
  }
  deleteAttendee(attendee: Attendee, onLessWarning: () => unknown) {
    const new_attendees = this.attendees.delete(attendee)

    if (onLessWarning == undefined)
      throw new Error('onLessWarning is must be defined.')

    if (new_attendees.length <= 1) {
      onLessWarning()
    }
    return Pair.regen({
      ...this.props,
      attendees: new_attendees,
    })
  }

  public static create(
    createProps: CreatePairProps,
  ): Pair | UnPemitedOperationError {
    const id = UUID.new()
    const props: PairProps = {
      id,
      name: createProps.name,
      attendees: createProps.attendees,
    }
    if (createProps.attendees.length >= 4) {
      throw new UnPemitedOperationError('4人以上のペアは作成できません')
    }
    if (createProps.attendees.length <= 1) {
      throw new UnPemitedOperationError('1人以下のペアは作成できません')
    }

    return new Pair(props)
  }

  public static regen(regenProps: PairProps): Pair {
    return new Pair(regenProps)
  }
}
