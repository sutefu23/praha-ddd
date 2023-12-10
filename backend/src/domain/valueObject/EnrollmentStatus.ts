import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameter } from '../error/DomainError'

export const StatusConst = {
  ENROLLMENT: '在籍中',
  TEMPORARY_ABSENCE: '休会中',
  WITHDRAWAL: '退会済',
} as const

export type StatusEnum = typeof StatusConst[keyof typeof StatusConst]

export class EnrollmentStatus extends ValueObject<StatusEnum> {
  private constructor(value: StatusEnum) {
    super(value)
  }
  public static of(value: StatusEnum): EnrollmentStatus | InvalidParameter {
    if (!Object.values(StatusConst).includes(value)) {
      return new InvalidParameter('不正な値です')
    }
    return new EnrollmentStatus(value)
  }
}
