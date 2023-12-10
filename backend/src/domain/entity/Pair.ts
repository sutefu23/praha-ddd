import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { UnPemitedOperation } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { PairName } from '../valueObject/PairName'

// ペア
export interface PairProps extends EntityProps {
  readonly uuid: UUID
  readonly name: PairName
  readonly attendees: PairAttendees
}

export interface CreatePairProps {
  readonly name: PairName
  readonly attendees: PairAttendees
}

export class Pair extends BaseEntity<PairProps> {
  public constructor(props: PairProps) {
    super(props)
  }

  get uuid(): UUID {
    return this.props.uuid
  }

  get name(): PairName {
    return this.props.name
  }

  get attendees(): PairAttendees {
    return this.props.attendees
  }

  setAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.add(attendee)
    if (new_attendees instanceof UnPemitedOperation) {
      return new_attendees // as UnPemitedOperation
    }

    return Pair.create({
      ...this.props,
      attendees: new_attendees,
    })
  }
  deleteAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.delete(attendee)
    if (new_attendees instanceof UnPemitedOperation) {
      return new_attendees // as UnPemitedOperation
    }

    return Pair.create({
      ...this.props,
      attendees: new_attendees,
    })
  }

  public static create(
    createProps: CreatePairProps,
  ): Pair | UnPemitedOperation {
    const uuid = UUID.new()
    const props: PairProps = {
      uuid,
      name: createProps.name,
      attendees: createProps.attendees,
    }
    return new Pair(props)
  }

  public static restore(restoreProps: PairProps): Pair {
    return new Pair(restoreProps)
  }
}

// ペア参加者の数におけるドメインロジックを集約させたかったので別で定義
class PairAttendees {
  private attendees: Attendee[]
  private constructor(attendees: Attendee[]) {
    if (attendees.length < 2) {
      throw new UnPemitedOperation(
        'ペアには少なくとも2人以上の参加者が必要です',
      )
    }
    if (attendees.length >= 4) {
      throw new UnPemitedOperation('4人以上のペアは作成できません')
    }

    this.attendees = attendees
  }
  static create(attendees: Attendee[]) {
    try {
      return new PairAttendees(attendees)
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }

  add(attendee: Attendee): PairAttendees | UnPemitedOperation {
    try {
      return new PairAttendees([...this.attendees, attendee])
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }
  delete(attendee: Attendee) {
    try {
      return new PairAttendees([...this.attendees, attendee])
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }
}
