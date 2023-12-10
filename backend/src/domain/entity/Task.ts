import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { UUID } from '../valueObject/UUID'
// 課題
export interface TaskProps extends EntityProps {
  readonly uuid: UUID
  readonly taskId: number
  readonly content: string
}

export interface CreateTaskProps {
  readonly taskId: number
  readonly content: string
}

export class Task extends BaseEntity<TaskProps> {
  public constructor(props: TaskProps) {
    super(props)
  }

  get uuid(): UUID {
    return this.props.uuid
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
      uuid: UUID.new(),
      taskId: createProps.taskId,
      content: createProps.content,
    }
    return new Task(props)
  }

  public static restore(restoreProps: TaskProps): Task {
    return new Task(restoreProps)
  }
}
