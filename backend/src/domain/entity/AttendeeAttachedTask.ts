import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { Task } from './Task'
import { TaskStatus, StatusConst } from '../valueObject/TaskStatus'
import { InvalidParameterError } from '../error/DomainError'
import { UUID } from '../valueObject/UUID'

// 参加者所有課題
export interface AttendeeAttachedTaskProps extends EntityProps {
  readonly id: UUID
  readonly attendee: Attendee
  readonly task: Task
  readonly status: TaskStatus
}

export interface CreateAttendeeAttachedTaskProps {
  readonly attendee: Attendee
  readonly task: Task
}

export class AttendeeAttachedTask extends BaseEntity<AttendeeAttachedTaskProps> {
  private constructor(props: AttendeeAttachedTaskProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get attendee(): Attendee {
    return this.props.attendee
  }

  get task(): Task {
    return this.props.task
  }

  public modifyStatus(
    newStatus: TaskStatus,
  ): AttendeeAttachedTask | InvalidParameterError {
    const oldStatus = this.props.status
    if (oldStatus.value === StatusConst.COMPLETED) {
      return new InvalidParameterError(
        '完了済みの課題のステータスは変更できません',
      )
    }
    return new AttendeeAttachedTask({
      ...this.props,
      newStatus,
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
