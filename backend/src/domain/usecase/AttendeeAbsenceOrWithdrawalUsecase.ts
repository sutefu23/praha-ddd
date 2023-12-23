import { Attendee } from '../entity/Attendee'
import {
  ActionError,
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import {
  StatusConst as EnrollmentConst,
  EnrollmentStatus,
} from '../valueObject/EnrollmentStatus'
import { UUID } from '../valueObject/UUID'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'
import { ISendMailAction } from '../interface/ISendMailAction'
import { IPairQueryService } from '../interface/IPairQueryService'
import { IPairRepository } from '../interface/IPairRepository'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { ITeamRepository } from '../interface/ITeamRepository'

export class AttendeeWithDrawalUsecase {
  constructor(
    private readonly attendeeRepository: IAttendeeRepository,
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly teamQueryService: ITeamQueryService,
    private readonly teamRepository: ITeamRepository,
    private readonly pairQueryService: IPairQueryService,
    private readonly pairRepository: IPairRepository,
    private readonly sendMailAction: ISendMailAction,
  ) {}

  async exec(
    targetAttendeeID: UUID,
    status:
      | typeof EnrollmentConst.WITHDRAWAL
      | typeof EnrollmentConst.TEMPORARY_ABSENCE,
  ): Promise<
    Attendee | InvalidParameterError | QueryError | QueryNotFoundError
  > {
    const attendee = await this.attendeeQueryService.findAttendeeById(
      targetAttendeeID,
    )
    const enrollment_status = EnrollmentStatus.of(status)
    if (enrollment_status instanceof InvalidParameterError) {
      return enrollment_status // as InvalidParameterError
    }

    if (attendee instanceof QueryError) {
      return attendee // as QueryError
    }

    if (attendee === null) {
      return new QueryNotFoundError('指定された参加者は存在しません。')
    }

    const modifiedAttendee = attendee.setEnrollmentStatus(enrollment_status)

    const team = await this.teamQueryService.findTeamsByAttendeeId(attendee.id)
    if (team instanceof QueryError) {
      return team // as QueryError
    }
    if (team === null) {
      return new QueryNotFoundError('所属するチームが見つかりません。')
    }

    const pair = await this.pairQueryService.findPairByAttendeeId(attendee.id)
    if (pair instanceof QueryError) {
      return pair // as QueryError
    }
    if (pair === null) {
      return new QueryNotFoundError('所属するペアが見つかりません。')
    }

    const modifiedTeam = team.deleteAttendee(attendee, () => {
      // 人数が少なくなった時の処理
      const mailRes = this.sendMailAction.sendToAdmin(
        `${modifiedAttendee.name}さんがペアを辞めました。`,
        `${modifiedAttendee.name}さんの在籍ステータスが${
          modifiedAttendee.enrollment_status
        }となりました。
        それにより所属チーム${modifiedTeam.name}が2名以下になりました。
        現在の参加者: ${modifiedTeam.attendees.map((a) => a.name).join(', ')}`,
      )
      if (mailRes instanceof ActionError) {
        return mailRes // as ActionError
      }
    })
    if (modifiedTeam instanceof UnPemitedOperationError) {
      return modifiedTeam // as UnPemitedOperationError
    }

    const modifiedPair = pair.deleteAttendee(attendee, () => {
      // 人数が少なくなった時の処理
      const mailRes = this.sendMailAction.sendToAdmin(
        `${modifiedAttendee.name}さんがペアを辞めました。`,
        `${modifiedAttendee.name}さんの在籍ステータスが${
          modifiedAttendee.enrollment_status
        }となりました。
        それにより所属ペア${modifiedPair.name}が1名以下になりました。
        現在の参加者: ${modifiedPair.attendees.map((a) => a.name).join(', ')}`,
      )
      if (mailRes instanceof ActionError) {
        return mailRes // as ActionError
      }
    })

    const res = await this.attendeeRepository.save(modifiedAttendee)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }

    return modifiedAttendee
  }
}
