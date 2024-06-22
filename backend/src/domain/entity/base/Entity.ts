import { UUID } from '../../valueObject/UUID'

export type EntityProps = {
  readonly id: UUID
}
export class BaseEntity<T extends EntityProps> {
  protected readonly props: T

  protected constructor(props: T) {
    this.props = Object.freeze(props)
  }
  equals = (other: BaseEntity<T>): boolean => {
    return other.props.id === this.props.id
  }
  create(props: T): BaseEntity<T> {
    console.log(props)
    throw new Error('Method not implemented.')
  }
  regen(props: T): BaseEntity<T> {
    console.log(props)
    throw new Error('Method not implemented.')
  }
}
