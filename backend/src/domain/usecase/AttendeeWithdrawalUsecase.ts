import { Attendee } from '../entity/Attendee'
import {
  ActionError,
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
} from '../error/DomainError'
import {
  StatusConst as EnrollmentConst,
  EnrollmentStatus,
} from '../valueObject/EnrollmentStatus'
import { UUID } from '../valueObject/UUID'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { ISendMailAction } from '../interface/ISendMailAction'
import { IPairQueryService } from '../interface/IPairQueryService'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { DeleteAttendeeService } from '../service/DeleteAttendeeService'

export class AttendeeWithdrawalUsecase {
  constructor(
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
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

    const deleteService = new DeleteAttendeeService(team)
    deleteService.deleteAttendee(
      attendee,
      () => {
        const mailRes = this.sendMailAction.sendToAdmin(
          `${modifiedAttendee.name}さんがペアを辞めました。`,
          `${modifiedAttendee.name}さんの在籍ステータスが${
            modifiedAttendee.enrollment_status
          }となりました。
        それにより所属チーム${team.name}が2名以下になりました。
        現在の${team.name}参加者:\n
         ${team
           .getAllAttendees()
           .map((a) => a.name)
           .join(', ')}`,
        )
        if (mailRes instanceof ActionError) {
          console.error(
            'チーム参加者が減った事による管理者通知メールの送信に失敗しました。\n',
            mailRes,
          )
        }
      },
      () => {
        const mailRes = this.sendMailAction.sendToAdmin(
          `ペア${pair}の自動割当が出来ません。`,
          `${modifiedAttendee.name}さんの在籍ステータスが${
            modifiedAttendee.enrollment_status
          }となりました。
          \nペア${pair}を辞めたことで自動で残りのメンバーの割当を行いましたが、
          チーム内に合流可能なペアがありません。
          現在のペア${pair.name}の参加者:\n
           ${pair.attendees.map((a) => a.name).join(', ')}\n
          手動で割り当ててください。`,
        )
        if (mailRes instanceof ActionError) {
          console.error(
            'ペアの自動割合が失敗したことによる管理者通知メールの送信に失敗しました。\n',
            mailRes,
          )
        }
      },
    )

    return modifiedAttendee
  }
}
