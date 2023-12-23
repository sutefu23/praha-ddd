/* eslint-disable @typescript-eslint/no-unused-vars */
// 破壊操作を禁止した配列
export class BaseArray<T> extends Array<T> {
  public push(...items: T[]): number {
    throw new Error('Method is impermitted.')
  }
  public unshift(...items: T[]): number {
    throw new Error('Method is impermitted.')
  }
  public splice(start: number, deleteCount?: number | undefined): T[] {
    throw new Error('Method is impermitted.')
  }
  public pop(): T | undefined {
    throw new Error('Method is impermitted.')
  }
  public shift(): T | undefined {
    throw new Error('Method is impermitted.')
  }
  public reverse(): T[] {
    throw new Error('Method is impermitted.')
  }
  public sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    throw new Error('Method is impermitted.')
  }
  public fill(
    value: T,
    start?: number | undefined,
    end?: number | undefined,
  ): this {
    throw new Error('Method is impermitted.')
  }
  public copyWithin(
    target: number,
    start: number,
    end?: number | undefined,
  ): this {
    throw new Error('Method is impermitted.')
  }
}
