import { Attendee } from '../entity/Attendee'
import { Team } from '../entity/Team'
import { Pair } from '../entity/Pair'
import {
  UnPemitedOperationError,
  NoEffectiveOperationError,
} from '../error/DomainError'

import { PairCollection } from '../entity/collection/PairCollection'
import { PairAttendeeTooManyError } from '../entity/Pair'
export class AddAttendeeService {
  constructor(private team: Team) {}

  addAttendee(attendee: Attendee, pair: Pair) {
    const hasAttendee = pair.attendees.has(attendee)
    if (hasAttendee) {
      return new NoEffectiveOperationError('既にこのペアに所属しています。')
    }

    const hasPair = this.team.pairs.find((p) => p.equals(pair))
    if (!hasPair) {
      return new UnPemitedOperationError(
        '対象のペアはこのチーム所属ではありません。',
      )
    }

    const new_pair = pair.addAttendee(attendee)

    if (new_pair instanceof PairAttendeeTooManyError) {
      return new_pair
    }

    const omitted_pairs = this.team.pairs.delete(pair)
    const new_pairs = new PairCollection([...omitted_pairs, new_pair])

    return Team.create({
      name: this.team.name,
      pairs: new_pairs,
    })
  }
}
