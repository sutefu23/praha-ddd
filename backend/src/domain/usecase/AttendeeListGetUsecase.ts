import { Attendee } from '../entity/Attendee'
import { QueryError } from '../error/DomainError'

import { IAttendeeQueryService } from '../interface/IAttendeeQueryService'

export class AttendeeListGetUsecase {
  constructor(
    private readonly repositoryClient: unknown,
    private readonly attendeeQueryService: IAttendeeQueryService,
  ) {}

  async exec(): Promise<Attendee[] | QueryError> {
    const attendees = await this.attendeeQueryService.findAllAttendees(
      this.repositoryClient,
    )
    if (attendees instanceof QueryError) {
      return attendees // as QueryError
    }

    return attendees
  }
}
