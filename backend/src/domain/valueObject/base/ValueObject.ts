import { shallowEqual } from 'src/util/shallowEqual'
import { isRecord } from 'src/util/isRecord'

export class BaseValueObject<T> {
  protected readonly _value: T

  protected constructor(value: T) {
    this._value = Object.freeze(value)
  }
  of(value: T): BaseValueObject<T> | Error {
    return new BaseValueObject(value)
  }

  get value(): T {
    return this._value
  }

  equals(vo: BaseValueObject<T>): boolean {
    if (typeof vo !== typeof this) {
      return false
    }
    if (isRecord(this._value) && isRecord(vo._value)) {
      return shallowEqual(this._value, vo._value)
    }
    // プリミティブ
    return this._value === vo._value
  }
}

interface ValueObjectProps {
  [key: string]: unknown
}

export abstract class ValueObject<
  T extends ValueObjectProps | number | string
> extends BaseValueObject<T> {}
