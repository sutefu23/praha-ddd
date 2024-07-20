import { Attendee } from '../entity/Attendee'
import {
  InvalidParameterError,
  NoEffectiveOperationError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
} from '../error/DomainError'

import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'
import { IPairQueryService } from '../interface/IPairQueryService'
import { ISendMailAction } from '../interface/ISendMailAction'
import { ITeamQueryService } from '../interface/ITeamQueryService'

import { StatusConst as EnrollmentStatusConst } from '../valueObject/EnrollmentStatus'
import { AttendeeRejoinUsecase } from './AttendeeRejoinUsecase'
import { AttendeeWithdrawUsecase } from './AttendeeWithdrawUsecase'

export class AttendeeModifyStatusUsecase {
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
    id: Attendee['id'],
    newStatus: Attendee['enrollment_status'],
  ): Promise<
    | Attendee
    | QueryError
    | InvalidParameterError
    | QueryNotFoundError
    | NoEffectiveOperationError
  > {
    const attendee = await this.attendeeQueryService.findAttendeeById(
      this.repositoryClient,
      id,
    )
    if (attendee instanceof QueryError) {
      return attendee // as QueryError
    }

    if (attendee === null) {
      return new QueryNotFoundError('指定された参加者が存在しません')
    }
    const oldStatus = attendee.enrollment_status

    if (oldStatus.value === EnrollmentStatusConst.WITHDRAWAL) {
      return new InvalidParameterError(
        '退会済みの参加者のステータス変更はできません',
      )
    }

    // 退会 or 休会
    if (
      newStatus.value === EnrollmentStatusConst.WITHDRAWAL ||
      newStatus.value === EnrollmentStatusConst.TEMPORARY_ABSENCE
    ) {
      const withdrowUsecase = new AttendeeWithdrawUsecase(
        this.repositoryClient,
        this.mailClient,
        this.attendeeQueryService,
        this.teamQueryService,
        this.pairQueryService,
        this.sendMailAction,
        this.attendeeRepository,
      )

      return withdrowUsecase.exec(attendee.id, newStatus.value)
    }

    // 復会
    if (
      oldStatus.value === EnrollmentStatusConst.TEMPORARY_ABSENCE &&
      newStatus.value === EnrollmentStatusConst.ENROLLMENT
    ) {
      const rejoinUsecase = new AttendeeRejoinUsecase(
        this.repositoryClient,
        this.attendeeQueryService,
        this.teamQueryService,
        this.pairQueryService,
        this.attendeeRepository,
      )

      return rejoinUsecase.exec(attendee.id, newStatus.value)
    }

    const modifiedAttendee = attendee.setEnrollmentStatus(newStatus)
    const res = await this.attendeeRepository.save(
      this.repositoryClient,
      modifiedAttendee,
    )
    if (res instanceof RepositoryError) {
      return res
    }
    return attendee
  }
}
