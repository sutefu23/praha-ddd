import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { UnPemitedOperationError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'
import { TeamName } from '../valueObject/TeamName'
import { AttendeeCollection } from './collection/AttendeeCollection'

// チーム
export interface TeamProps extends EntityProps {
  readonly id: UUID
  readonly name: TeamName
  readonly attendees: AttendeeCollection
}

export interface CreateTeamProps {
  readonly name: TeamName
  readonly attendees: AttendeeCollection
}

export class Team extends BaseEntity<TeamProps> {
  public constructor(props: TeamProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get name(): TeamName {
    return this.props.name
  }

  get attendees(): AttendeeCollection {
    return this.props.attendees
  }

  setAttendee(attendee: Attendee) {
    const new_attendees = this.attendees.add(attendee)
    return Team.regen({
      ...this.props,
      attendees: new_attendees,
    })
  }

  deleteAttendee(attendee: Attendee, onLessWarning: () => unknown) {
    const new_attendees = this.attendees.delete(attendee)
    if (onLessWarning == undefined)
      throw new Error('onLessWarning is must be defined.')
    if (new_attendees.length < 2) {
      onLessWarning()
    }
    return Team.regen({
      ...this.props,
      attendees: new_attendees,
    })
  }

  public static create(
    createProps: CreateTeamProps,
  ): Team | UnPemitedOperationError {
    const id = UUID.new()
    const props: TeamProps = {
      id,
      name: createProps.name,
      attendees: createProps.attendees,
    }
    if (createProps.attendees.length <= 3) {
      throw new UnPemitedOperationError(
        'チームには最低3人以上いなければなりません。',
      )
    }
    return new Team(props)
  }

  public static regen(regenProps: TeamProps): Team {
    return new Team(regenProps)
  }
}
