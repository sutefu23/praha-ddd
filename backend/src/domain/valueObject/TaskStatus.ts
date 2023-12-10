import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameter } from '../error/DomainError'

export const StatusConst = {
  NOT_STARTED: '未着手',
  REVIEW_PENDING: 'レビュー待ち',
  COMPLETED: '完了',
} as const

export type StatusEnum = typeof StatusConst[keyof typeof StatusConst]

export class TaskStatus extends ValueObject<StatusEnum> {
  private constructor(value: StatusEnum) {
    super(value)
  }
  public static of(value: StatusEnum): TaskStatus | InvalidParameter {
    if (!Object.values(StatusConst).includes(value)) {
      return new InvalidParameter('不正な値です')
    }
    return new TaskStatus(value)
  }
}
