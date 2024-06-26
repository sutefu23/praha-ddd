import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameterError } from '../error/DomainError'

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
  public static new(value: StatusEnum): TaskStatus | InvalidParameterError {
    if (!Object.values(StatusConst).includes(value)) {
      return new InvalidParameterError('不正な値です')
    }
    return new TaskStatus(value)
  }
  public static parse(value: string): TaskStatus | InvalidParameterError {
    if (Object.values(StatusConst).includes(value as StatusEnum)) {
      return new TaskStatus(value as StatusEnum)
    }
    return new InvalidParameterError('不正な値です')
  }
  public static mustParse(value: string): TaskStatus {
    if (Object.values(StatusConst).includes(value as StatusEnum)) {
      return new TaskStatus(value as StatusEnum)
    }
    // 敢えてretunではなくスローしています。
    throw new InvalidParameterError('不正な値です')
  }
}
