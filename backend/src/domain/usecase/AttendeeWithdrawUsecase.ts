import { Attendee } from '../entity/Attendee'
import {
  ActionError,
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
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
import { PrahaWithdrawAttendeeService } from '../service/PrahaWithdrawAttendeeService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'

export class AttendeeWithdrawUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly mailClient: unknown,
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
    private readonly sendMailAction: ISendMailAction,
    private readonly attendeeRepository: IAttendeeRepository,
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
      this.repositoryClient,
      targetAttendeeID,
    )
    const enrollment_status = EnrollmentStatus.new(status)
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

    const team = await this.teamQueryService.findTeamsByAttendeeId(
      this.repositoryClient,

      attendee.id,
    )
    if (team instanceof QueryError) {
      return team // as QueryError
    }
    if (team === null) {
      return new QueryNotFoundError('所属するチームが見つかりません。')
    }

    const pair = await this.pairQueryService.findPairByAttendeeId(
      this.repositoryClient,

      attendee.id,
    )
    if (pair instanceof QueryError) {
      return pair // as QueryError
    }
    if (pair === null) {
      return new QueryNotFoundError('所属するペアが見つかりません。')
    }

    const allTeams = await this.teamQueryService.findAllTeams(
      this.repositoryClient,
    )
    if (allTeams instanceof QueryError) {
      return allTeams // as QueryError
    }
    const deleteService = new PrahaWithdrawAttendeeService(allTeams)
    deleteService.deleteAttendee(
      attendee,
      () => {
        const mailRes = this.sendMailAction.sendToAdmin(
          this.mailClient,
          `${modifiedAttendee.name}さんがペアを辞めました。`,
          `${modifiedAttendee.name}さんの在籍ステータスが${
            modifiedAttendee.enrollment_status.value
          }となりました。
        それにより所属チーム${team.name.value}が2名以下になりました。
        現在の${team.name.value}参加者:\n
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
          this.mailClient,
          `ペア${pair.name.value}の自動割当が出来ません。`,
          `${modifiedAttendee.name}さんの在籍ステータスが${
            modifiedAttendee.enrollment_status.value
          }となりました。
          \nペア${
            pair.name.value
          }を辞めたことで自動で残りのメンバーの割当を行いましたが、
          チーム内に合流可能なペアがありません。
          現在のペア${pair.name.value}の参加者:\n
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
    const res = await this.attendeeRepository.save(
      this.repositoryClient,
      modifiedAttendee,
    )
    if (res instanceof RepositoryError) {
      return res
    }
    return modifiedAttendee
  }
}
