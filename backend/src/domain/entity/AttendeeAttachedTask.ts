import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { Task } from './Task'
import { TaskStatus, StatusConst } from '../valueObject/TaskStatus'
import { UUID } from '../valueObject/UUID'
import { InvalidParameterError } from '../error/DomainError'

// 参加者所有課題
export interface AttendeeAttachedTaskProps extends EntityProps {
  readonly id: UUID
  readonly attendeeUUId: Attendee['id']
  readonly taskUUId: Task['id']
  readonly status: TaskStatus
}

export interface CreateAttendeeAttachedTaskProps {
  readonly attendeeUUId: Attendee['id']
  readonly taskUUId: Task['id']
}

export class AttendeeAttachedTask extends BaseEntity<AttendeeAttachedTaskProps> {
  private constructor(props: AttendeeAttachedTaskProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  setContent(content: string) {
    return new AttendeeAttachedTask({
      ...this.props,
      content,
    })
  }

  public static create(
    createProps: CreateAttendeeAttachedTaskProps,
  ): AttendeeAttachedTask | InvalidParameterError {
    const status = TaskStatus.new(StatusConst.NOT_STARTED)
    if (status instanceof InvalidParameterError) {
      return status
    }

    const props: AttendeeAttachedTaskProps = {
      id: UUID.new(),
      status: status,
      ...createProps,
    }
    return new AttendeeAttachedTask(props)
  }

  public static regen(
    regenProps: AttendeeAttachedTaskProps,
  ): AttendeeAttachedTask {
    return new AttendeeAttachedTask(regenProps)
  }
}
