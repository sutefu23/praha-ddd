import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameter } from '../error/DomainError'

export class PairName extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }
  public static of(value: string): PairName | InvalidParameter {
    if (value.length != 1) {
      return new InvalidParameter('ペア名は1文字でなければなりません')
    }

    if (!/^[a-Z]+$/.test(value)) {
      return new InvalidParameter('ペア名はアルファベットでなければなりません')
    }

    return new PairName(value)
  }
}
