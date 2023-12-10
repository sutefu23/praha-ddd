import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { UnPemitedOperation } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { TeamName } from '../valueObject/TeamName'

// チーム
export interface TeamProps extends EntityProps {
  readonly uuid: UUID
  readonly name: TeamName
  readonly attendees: TeamAttendees
}

export interface CreateTeamProps {
  readonly name: TeamName
  readonly attendees: TeamAttendees
}

export class Team extends BaseEntity<TeamProps> {
  public constructor(props: TeamProps) {
    super(props)
  }

  get uuid(): UUID {
    return this.props.uuid
  }

  get name(): TeamName {
    return this.props.name
  }

  get attendees(): TeamAttendees {
    return this.props.attendees
  }

  setAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.add(attendee)
    if (new_attendees instanceof UnPemitedOperation) {
      return new_attendees // as UnPemitedOperation
    }

    return Team.create({
      ...this.props,
      attendees: new_attendees,
    })
  }
  deleteAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.delete(attendee)
    if (new_attendees instanceof UnPemitedOperation) {
      return new_attendees // as UnPemitedOperation
    }

    return Team.create({
      ...this.props,
      attendees: new_attendees,
    })
  }

  public static create(
    createProps: CreateTeamProps,
  ): Team | UnPemitedOperation {
    const uuid = UUID.new()
    const props: TeamProps = {
      uuid,
      name: createProps.name,
      attendees: createProps.attendees,
    }
    return new Team(props)
  }

  public static restore(restoreProps: TeamProps): Team {
    return new Team(restoreProps)
  }
}

// チーム参加者の数におけるドメインロジックを集約させたかったので別で定義
class TeamAttendees {
  private attendees: Attendee[]
  private constructor(attendees: Attendee[]) {
    if (attendees.length < 3) {
      throw new UnPemitedOperation(
        'チームには少なくとも3人以上の参加者が必要です',
      )
    }
    this.attendees = attendees
  }
  static create(attendees: Attendee[]) {
    try {
      return new TeamAttendees(attendees)
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }
  add(attendee: Attendee): TeamAttendees | UnPemitedOperation {
    try {
      return new TeamAttendees([...this.attendees, attendee])
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }
  delete(attendee: Attendee) {
    try {
      return new TeamAttendees([...this.attendees, attendee])
    } catch (e) {
      if (e instanceof UnPemitedOperation) {
        return e
      }
      throw e
    }
  }
}
