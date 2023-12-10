import { Attendee, CreateAttendeeProps } from '../entity/Attendee'
import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'
import { IAttendeeRepository } from '../interface/IAttendeeRepository'
import {
  InvalidParameter,
  QueryError,
  RepositoryError,
} from '../error/DomainError'

export class AttendeeUsecase {
  constructor(
    private readonly attendeeRepository: IAttendeeRepository,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async createAttendee(
    attendeeProps: CreateAttendeeProps,
  ): Promise<Attendee | InvalidParameter | RepositoryError> {
    const hasAttendee = await this.attendeeQueryService.findAttendeeByName(
      attendeeProps.name,
    )
    if (hasAttendee instanceof QueryError) {
      return hasAttendee // as QueryError
    }

    if (hasAttendee !== null) {
      return new InvalidParameter(
        '同名の参加者が既に存在します。別の名前を指定してください。',
      )
    }
    const attendee = Attendee.create(attendeeProps)
    if (attendee instanceof InvalidParameter) {
      return attendee // as InvalidParameter
    }
    const res = await this.attendeeRepository.save(attendee)
    if (res instanceof RepositoryError) {
      return res // as RepositoryError
    }
    return attendee
  }
}
