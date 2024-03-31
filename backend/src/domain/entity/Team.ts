import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Pair } from './Pair'

import { UUID } from '../valueObject/UUID'
import { TeamName } from '../valueObject/TeamName'
import { PairCollection } from './collection/PairCollection'
import { AttendeeCollection } from './collection/AttendeeCollection'
import { UnPemitedOperationError } from '../error/DomainError'

// チーム
export interface TeamProps extends EntityProps {
  readonly id: UUID
  readonly name: TeamName
  readonly pairs: Pair[]
}

export interface CreateTeamProps {
  readonly name: TeamName
  readonly pairs: Pair[]
}

export class Team extends BaseEntity<TeamProps> {
  private constructor(props: TeamProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get name(): TeamName {
    return this.props.name
  }

  get pairs(): PairCollection {
    return new PairCollection(this.props.pairs)
  }

  getAllAttendees(): AttendeeCollection {
    const attendees = this.pairs.map((pair) => pair.attendees).flat()
    return new AttendeeCollection(attendees)
  }

  addPair(pair: Pair) {
    const new_pair = this.pairs.add(pair)
    return new Team({
      ...this.props,
      pair: new_pair,
    })
  }

  deletePair(pair: Pair) {
    const new_pairs = this.pairs.delete(pair)

    return new Team({
      ...this.props,
      pairs: new_pairs,
    })
  }

  replacePair(pair: Pair) {
    const new_pairs = this.pairs.delete(pair).add(pair)
    return new Team({
      ...this.props,
      pairs: new_pairs,
    })
  }

  public static create(
    createProps: CreateTeamProps,
  ): Team | UnPemitedOperationError {
    const id = UUID.new()
    const props: TeamProps = {
      id,
      name: createProps.name,
      pairs: createProps.pairs,
    }
    const attendees = createProps.pairs.flatMap((pair) => pair.attendees)

    if (attendees.length < 3) {
      return new UnPemitedOperationError(
        'チームには最低3人以上いなければなりません',
      )
    }
    return new Team(props)
  }

  public static regen(regenProps: TeamProps): Team {
    return new Team(regenProps)
  }
}
