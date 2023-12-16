import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { UUID } from '../valueObject/UUID'
// 課題
export interface TaskProps extends EntityProps {
  readonly id: UUID
  readonly taskNumber: number
  readonly content: string
}

export interface CreateTaskProps {
  readonly taskNumber: number
  readonly content: string
}

export class Task extends BaseEntity<TaskProps> {
  public constructor(props: TaskProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get taskNumber(): number {
    return this.props.taskNumber
  }

  get content(): string {
    return this.props.content
  }

  setContent(content: string) {
    return new Task({
      ...this.props,
      content,
    })
  }

  public static create(createProps: CreateTaskProps): Task {
    const props: TaskProps = {
      id: UUID.new(),
      taskNumber: createProps.taskNumber,
      content: createProps.content,
    }
    return new Task(props)
  }

  public static restore(restoreProps: TaskProps): Task {
    return new Task(restoreProps)
  }
}
