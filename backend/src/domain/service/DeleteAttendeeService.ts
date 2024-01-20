import { Attendee } from '../entity/Attendee'
import { Team } from '../entity/Team'
import {
  Pair,
  PairAttendeeTooLessError,
  PairAttendeeTooManyError,
} from '../entity/Pair'
import { UnPemitedOperationError } from '../error/DomainError'

import { PairCollection } from '../entity/collection/PairCollection'
export class DeleteAttendeeService {
  constructor(private team: Team) {}

  deleteAttendee(
    attendee: Attendee,
    onLessPairAlartAction: () => unknown,
    onUnableAllocateAction: () => unknown,
  ): Team | UnPemitedOperationError {
    const pair = this.team.pairs.find((pair) => pair.attendees.has(attendee))
    if (!pair) {
      return new UnPemitedOperationError(
        '該当の参加者のチーム内のペアへの所属が確認できませんでした。',
      )
    }
    const attendeeDeletedPair = pair?.deleteAttendee(attendee)
    const otherPairs = this.team.pairs.delete(pair)

    // ペアが少なすぎるため自動で割り当てる
    if (attendeeDeletedPair instanceof PairAttendeeTooLessError) {
      onLessPairAlartAction() // ペアが少ない場合のアラート
      const allocatedPair = this.autoAlocateAttendee(attendee)
      if (allocatedPair instanceof UnPemitedOperationError) {
        onUnableAllocateAction() // 自動割合ができなかった場合のアラート
        return allocatedPair
      }

      return Team.create({
        name: this.team.name,
        pairs: new PairCollection([
          ...otherPairs.delete(allocatedPair),
          allocatedPair,
        ]),
      })
    }
    // 通常の処理
    const new_pairs = new PairCollection([...otherPairs, attendeeDeletedPair])

    return Team.create({
      name: this.team.name,
      pairs: new_pairs,
    })
  }

  private autoAlocateAttendee(
    attendee: Attendee,
  ): Pair | UnPemitedOperationError {
    const pair = this.team.pairs.find((p) => p.attendees.has(attendee))
    if (!pair) {
      return new UnPemitedOperationError(
        '該当の参加者のチーム内のペアへの所属が確認できませんでした。',
      )
    }
    const otherPairs = this.team.pairs.delete(pair)
    if (otherPairs.length === 0) {
      return new UnPemitedOperationError(
        '他のペアが存在せず自動でペアを割り当てることができませんでした。',
      )
    }
    // 一番少ないペアを取得（少ないペアが複数ある場合でも並び順から適当に選ばれる）
    const mostLessPair = otherPairs.toSorted(
      (a, b) => a.attendees.length - b.attendees.length,
    )[0]

    if (!mostLessPair) {
      return new UnPemitedOperationError(
        'ペアが存在せず自動でペアを割り当てることができませんでした。',
      )
    }

    const autoAllocatedPair = mostLessPair.addAttendee(attendee)
    if (autoAllocatedPair instanceof PairAttendeeTooManyError) {
      return new UnPemitedOperationError(
        '既にどのペアも参加者が多すぎるため、チームの中で最も最小のペアに参加者を自動で追加することができませんでした。',
      )
    }
    return autoAllocatedPair
  }
}
