import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameterError } from '../error/DomainError'

export class TeamName extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }
  public static new(value: string): TeamName | InvalidParameterError {
    if (value.length > 3) {
      return new InvalidParameterError(
        'チーム名は3文字以下でなければなりません',
      )
    }

    if (!/^[0-9]+$/.test(value)) {
      return new InvalidParameterError('チーム名は数字のみでなければなりません')
    }

    return new TeamName(value)
  }
  public static mustParse(value: string): TeamName {
    return new TeamName(value)
  }
}
