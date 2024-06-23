import { Attendee } from '../entity/Attendee'
import {
  InvalidParameterError,
  QueryError,
  QueryNotFoundError,
} from '../error/DomainError'

import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'

export class AttendeeGetUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async exec(
    id: Attendee['id'],
  ): Promise<Attendee | InvalidParameterError | QueryError> {
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

    return attendee
  }
}
