import { Attendee, CreateAttendeeProps } from '../entity/Attendee'
import {
  InvalidParameterError,
  QueryError,
  RepositoryError,
} from '../error/DomainError'

import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'

export class AttendeeCreateUsecase {
  constructor(
    private readonly attendeeRepository: IAttendeeRepository,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async exec(
    attendeeProps: CreateAttendeeProps,
  ): Promise<Attendee | InvalidParameterError | RepositoryError> {
    const hasAttendee = await this.attendeeQueryService.findAttendeeByEmail(
      attendeeProps.email,
    )
    if (hasAttendee instanceof QueryError) {
      return hasAttendee // as QueryError
    }

    if (hasAttendee !== null) {
      return new InvalidParameterError('同じメールの登録者が既に存在します。')
    }

    const attendee = Attendee.create(attendeeProps)
    if (attendee instanceof InvalidParameterError) {
      return attendee // as InvalidParameterError
    }

    const res = await this.attendeeRepository.save(attendee)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return attendee
  }
}
