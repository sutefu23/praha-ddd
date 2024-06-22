// shallowEqual.spec.ts
import { shallowEqual } from './shallowEqual'

describe('shallowEqual', () => {
  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = { a: 1, b: 'test' }
    expect(shallowEqual(obj1, obj2)).toBe(true)
  })

  it('should return false for objects with different values', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = { a: 1, b: 'different' }
    expect(shallowEqual(obj1, obj2)).toBe(false)
  })

  it('should return false for objects with different keys', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = { a: 1, c: 'test' }
    expect(shallowEqual(obj1, (obj2 as unknown) as typeof obj1)).toBe(false)
  })

  it('should return false if one object has more keys', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = { a: 1, b: 'test', c: 3 }
    expect(shallowEqual(obj1, obj2)).toBe(false)
  })

  it('should return true for empty objects', () => {
    const obj1 = {}
    const obj2 = {}
    expect(shallowEqual(obj1, obj2)).toBe(true)
  })

  it('should return true if both objects reference the same object', () => {
    const obj = { a: 1, b: 'test' }
    expect(shallowEqual(obj, obj)).toBe(true)
  })

  it('should return false if one of the objects is null', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = null
    expect(shallowEqual(obj1, (obj2 as unknown) as typeof obj1)).toBe(false)
  })

  it('should return false if one of the objects is not an object', () => {
    const obj1 = { a: 1, b: 'test' }
    const obj2 = 123
    expect(shallowEqual(obj1, (obj2 as unknown) as typeof obj1)).toBe(false)
  })

  it('should return true for objects with same keys and undefined values', () => {
    const obj1 = { a: undefined, b: undefined }
    const obj2 = { a: undefined, b: undefined }
    expect(shallowEqual(obj1, obj2)).toBe(true)
  })
})
