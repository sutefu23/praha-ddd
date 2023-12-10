import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameter } from '../error/DomainError'

export class TeamName extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }
  public static of(value: string): TeamName | InvalidParameter {
    if (value.length <= 3) {
      return new InvalidParameter('チーム名は3文字以下でなければなりません')
    }

    if (!/^[0-9]+$/.test(value)) {
      return new InvalidParameter('チーム名は数字のみでなければなりません')
    }

    return new TeamName(value)
  }
}
