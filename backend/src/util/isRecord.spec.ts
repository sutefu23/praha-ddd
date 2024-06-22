// isRecord.spec.ts
import { isRecord } from './isRecord'

describe('isRecord', () => {
  it('should return true for plain objects', () => {
    const obj = { a: 1, b: 'test' }
    expect(isRecord(obj)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isRecord(null)).toBe(false)
  })

  it('should return false for arrays', () => {
    const arr = [1, 2, 3]
    expect(isRecord(arr)).toBe(false)
  })

  it('should return false for functions', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const func = () => {}
    expect(isRecord(func)).toBe(false)
  })

  it('should return false for strings', () => {
    const str = 'string'
    expect(isRecord(str)).toBe(false)
  })

  it('should return false for numbers', () => {
    const num = 123
    expect(isRecord(num)).toBe(false)
  })

  it('should return false for booleans', () => {
    const bool = true
    expect(isRecord(bool)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isRecord(undefined)).toBe(false)
  })

  it('should return true for objects with prototype chain', () => {
    const obj = Object.create({ a: 1 })
    expect(isRecord(obj)).toBe(true)
  })
})
