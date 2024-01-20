import { Attendee } from '../entity/Attendee'
import {
  InvalidParameterError,
  NoEffectiveOperationError,
  QueryError,
  QueryNotFoundError,
  UnPemitedOperationError,
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
import { AddAttendeeService } from '../service/AddAttendeeService'

export class AttendeeRejoinUsecase {
  constructor(
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
    private readonly sendMailAction: ISendMailAction,
  ) {}

  async exec(
    targetAttendeeID: UUID,
    status: typeof EnrollmentConst.ENROLLMENT,
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

    const addService = new AddAttendeeService(team)
    const new_team = addService.addAttendee(attendee, pair)
    if (new_team instanceof NoEffectiveOperationError) {
      return new_team // as NoEffectiveOperationError
    }

    if (new_team instanceof UnPemitedOperationError) {
      return new_team // as UnPemitedOperationError
    }

    return modifiedAttendee
  }
}
