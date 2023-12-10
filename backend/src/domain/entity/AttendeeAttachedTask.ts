import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { Attendee } from './Attendee'
import { Task } from './Task'
import { TaskStatus } from '../valueObject/TaskStatus'
import { UUID } from '../valueObject/UUID'

// 参加者所有課題
export interface AttendeeAttachedTaskProps extends EntityProps {
  readonly uuid: UUID
  readonly attendeeUUId: Attendee['uuid']
  readonly taskUUId: Task['uuid']
  readonly status: TaskStatus
}

export interface CreateAttendeeAttachedTaskProps {
  readonly attendeeUUId: Attendee['uuid']
  readonly taskUUId: Task['uuid']
  readonly status: TaskStatus
}

export class AttendeeAttachedTask extends BaseEntity<AttendeeAttachedTaskProps> {
  public constructor(props: AttendeeAttachedTaskProps) {
    super(props)
  }

  get uuid(): UUID {
    return this.props.uuid
  }

  setContent(content: string) {
    return new AttendeeAttachedTask({
      ...this.props,
      content,
    })
  }

  public static create(
    createProps: CreateAttendeeAttachedTaskProps,
  ): AttendeeAttachedTask {
    const props: AttendeeAttachedTaskProps = {
      uuid: UUID.new(),
      ...createProps,
    }
    return new AttendeeAttachedTask(props)
  }

  public static restore(
    restoreProps: AttendeeAttachedTaskProps,
  ): AttendeeAttachedTask {
    return new AttendeeAttachedTask(restoreProps)
  }
}
