import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameterError } from '../error/DomainError'

export class PairName extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }
  public static new(value: string): PairName | InvalidParameterError {
    if (value.length != 1) {
      return new InvalidParameterError('ペア名は1文字でなければなりません')
    }

    if (!/^[a-Z]+$/.test(value)) {
      return new InvalidParameterError(
        'ペア名はアルファベットでなければなりません',
      )
    }
    return new PairName(value)
  }
  // 任意のアルファベット1文字のペア名を自動生成
  public static autoGenarate(): PairName {
    const random = Math.floor(Math.random() * 26)
    const charCode = 'A'.charCodeAt(0) + random
    return new PairName(String.fromCharCode(charCode))
  }
  // アルファベットの次の文字のペア名を生成
  public getNextAlphabetPairName(): PairName {
    const char = this.value

    const nextCharCode = char.charCodeAt(0) + 1
    const nextChar = String.fromCharCode(nextCharCode)
    return new PairName(nextChar)
  }
}
