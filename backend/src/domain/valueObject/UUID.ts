import { ValueObject } from 'src/domain/valueObject/base/ValueObject'
import { InvalidParameterError } from '../error/DomainError'
import { v4 as uuidv4, validate } from 'uuid'
export class UUID extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }
  public static new(): UUID {
    const uuid = generateUUID()
    return new UUID(uuid)
  }
  public static of(value: string): UUID | InvalidParameterError {
    if (!isValieUUID(value)) {
      return new InvalidParameterError('不正な値です')
    }
    return new UUID(value)
  }
  public static mustParse(value: string): UUID {
    if (!isValieUUID(value)) {
      throw new InvalidParameterError('不正な値です')
    }
    return new UUID(value)
  }
  public toString(): string {
    return this.value
  }
}
// コアドメインをライブラリに依存させたくなかったため別で定義
// （自分で書いたり差し替える余地を残している）
function generateUUID(): string {
  return uuidv4()
}

function isValieUUID(value: string): boolean {
  return validate(value)
}
