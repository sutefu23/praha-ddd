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
    const hasAttendee = await this.attendeeQueryService.findAttendeeByName(
      attendeeProps.name,
    )
    if (hasAttendee instanceof QueryError) {
      return hasAttendee // as QueryError
    }

    if (hasAttendee !== null) {
      return new InvalidParameterError(
        '同名の参加者が既に存在します。別の名前を指定してください。',
      )
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
