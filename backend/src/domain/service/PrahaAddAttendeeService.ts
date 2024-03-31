import { Attendee } from '../entity/Attendee'
import {
  InvalidParameterError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { Pair, PairAttendeeTooManyError } from '../entity/Pair'
import { TeamCollection } from '../entity/collection/TeamCollection'

export class PrahaAddAttendeeService {
  constructor(private allTeams: TeamCollection) {}

  addAttendee(attendee: Attendee) {
    const allTeams = this.allTeams
    if (!allTeams[0]) {
      return new UnPemitedOperationError(
        'チームが存在せず自動で増員を割り当てることができませんでした。',
      )
    }
    const smallestTeam = allTeams.reduce((smallest, current) => {
      return current.pairs?.length < smallest.pairs?.length ? current : smallest
    }, allTeams[0])

    const mostLessPair = smallestTeam.pairs.toSorted(
      (a, b) => a.attendees.length - b.attendees.length,
    )[0]

    if (!mostLessPair) {
      return new UnPemitedOperationError(
        'ペアが存在せず自動でペアを割り当てることができませんでした。',
      )
    }

    const autoAllocatedPair = mostLessPair.addAttendee(attendee)
    // 割当先のペアが人数多すぎエラーで失敗
    if (autoAllocatedPair instanceof PairAttendeeTooManyError) {
      console.warn(
        '既にどのペアも参加者が多すぎるため、チームの中で最も最小のペアに参加者を自動で追加することができませんでした。',
      )
      // ペアを分割する処理を行う
      const splitedPairs = this.splitPair(mostLessPair)
      if (splitedPairs instanceof InvalidParameterError) {
        return splitedPairs
      }
      const [current_pair, new_pair] = splitedPairs
      const new_team = smallestTeam.replacePair(current_pair).addPair(new_pair)
      return this.allTeams.replaceTeam(new_team)
    }
    //　通常の処理
    const new_team = smallestTeam.replacePair(autoAllocatedPair)
    return this.allTeams.replaceTeam(new_team)
  }
  private splitPair(target_pair: Pair): [Pair, Pair] | InvalidParameterError {
    const moveCount = Math.floor(target_pair.attendees.length / 2)
    const moveAttendees = target_pair.attendees.slice(0, moveCount)
    const stayAttendees = target_pair.attendees.slice(moveCount)

    const current_pair = Pair.regen({
      id: target_pair.id,
      name: target_pair.name,
      attendees: stayAttendees,
    })
    const lastPairName = this.allTeams.allPairs.toSorted(
      (a, b) =>
        b.name.value.toLowerCase().charCodeAt(0) -
        a.name.value.toLowerCase().charCodeAt(0),
    )[0]?.name
    if (!lastPairName) {
      return new InvalidParameterError('分割すべきペアが存在しません')
    }

    const new_pair_name = lastPairName.getNextAlphabetPairName()
    const new_pair = Pair.create({
      name: new_pair_name,
      attendees: moveAttendees,
    })
    return [current_pair, new_pair]
  }
}
