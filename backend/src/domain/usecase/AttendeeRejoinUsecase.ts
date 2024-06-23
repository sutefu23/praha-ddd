import { Attendee } from '../entity/Attendee'
import {
  InvalidParameterError,
  NoEffectiveOperationError,
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
import { IPairQueryService } from '../interface/IPairQueryService'
import { ITeamQueryService } from '../interface/ITeamQueryService'
import { PrahaRejoinAttendeeService } from '../service/PrahaRejoinAttendeeService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'

export class AttendeeRejoinUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly attendeeQueryService: IAttendeeQueryService,
    private readonly teamQueryService: ITeamQueryService,
    private readonly pairQueryService: IPairQueryService,
    private readonly attendeeRepository: IAttendeeRepository,
  ) {}

  async exec(
    targetAttendeeID: UUID,
    status: typeof EnrollmentConst.ENROLLMENT,
  ): Promise<
    | Attendee
    | InvalidParameterError
    | QueryError
    | QueryNotFoundError
    | RepositoryError
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
    const addService = new PrahaRejoinAttendeeService(allTeams)
    const new_team = addService.addAttendee(attendee)
    if (new_team instanceof NoEffectiveOperationError) {
      return new_team // as NoEffectiveOperationError
    }

    if (new_team instanceof UnPemitedOperationError) {
      return new_team // as UnPemitedOperationError
    }
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
