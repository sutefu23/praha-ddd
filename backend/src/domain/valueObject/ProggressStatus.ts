import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameterError } from '../error/DomainError'

export const StatusConst = {
  NOT_STARTED: '未着手',
  REVIEW_WAITING: 'レビュー待ち',
  COMPLETED: '完了',
} as const

export type StatusEnum = typeof StatusConst[keyof typeof StatusConst]

export class ProgressStatus extends ValueObject<StatusEnum> {
  private constructor(value: StatusEnum) {
    super(value)
  }
  public static new(value: StatusEnum): ProgressStatus | InvalidParameterError {
    if (!Object.values(StatusConst).includes(value)) {
      return new InvalidParameterError('不正な値です')
    }
    return new ProgressStatus(value)
  }
  public static mustParse(value: StatusEnum): ProgressStatus {
    if (Object.values(StatusConst).includes(value)) {
      return new ProgressStatus(value)
    }
    throw new InvalidParameterError('不正な値です')
  }
}
