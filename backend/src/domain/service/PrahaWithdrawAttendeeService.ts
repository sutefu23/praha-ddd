import { Attendee } from '../entity/Attendee'
import { Pair } from '../entity/Pair'
import {
  PairAttendeeTooLessError,
  PairAttendeeTooManyError,
} from '../entity/collection/PairAttendeeCollection'
import { TeamCollection } from '../entity/collection/TeamCollection'
import { UnPemitedOperationError } from '../error/DomainError'

export class PrahaDeleteAttendeeService {
  constructor(private allTeams: TeamCollection) {}

  deleteAttendee(
    attendee: Attendee,
    onLessPairAlartAction: () => unknown,
    onUnableAllocateAction: () => unknown,
  ): TeamCollection | UnPemitedOperationError {
    const belong_pair = this.allTeams.allPairs.find((pair) =>
      pair.attendees.has(attendee),
    )
    if (!belong_pair) {
      return new UnPemitedOperationError(
        '該当の参加者のチーム内のペアへの所属が確認できませんでした。',
      )
    }

    const belong_team = this.allTeams.find((team) =>
      team.pairs.has(belong_pair),
    )
    if (!belong_team) {
      return new UnPemitedOperationError(
        '該当の参加者のチームが確認できませんでした。',
      )
    }
    const attendeeDeletedPair = belong_pair?.deleteAttendee(attendee)

    // ペアが少なすぎるため自動で割り当てる
    if (attendeeDeletedPair instanceof PairAttendeeTooLessError) {
      onLessPairAlartAction() // ペアが少ない場合のアラート
      const allocatedPair = this.autoAlocateAttendee(attendee)
      if (allocatedPair instanceof UnPemitedOperationError) {
        onUnableAllocateAction() // 自動割合ができなかった場合のアラート
        return allocatedPair
      }
      const new_team = belong_team.replacePair(allocatedPair)
      return this.allTeams.replaceTeam(new_team)
    }
    // 通常の処理
    const new_team = belong_team.replacePair(attendeeDeletedPair)
    return this.allTeams.replaceTeam(new_team)
  }

  private autoAlocateAttendee(
    attendee: Attendee,
  ): Pair | UnPemitedOperationError {
    const belong_pair = this.allTeams.allPairs.find((p) =>
      p.attendees.has(attendee),
    )
    if (!belong_pair) {
      return new UnPemitedOperationError(
        '該当の参加者のチーム内のペアへの所属が確認できませんでした。',
      )
    }

    const belong_team = this.allTeams.find((team) =>
      team.pairs.has(belong_pair),
    )
    if (!belong_team) {
      return new UnPemitedOperationError(
        '該当の参加者のチームが確認できませんでした。',
      )
    }
    const otherPairs = belong_team.pairs.delete(belong_pair)
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
