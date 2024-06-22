import { InvalidParameterError } from '../error/DomainError'
import { UUID } from './UUID'
describe('UUID', () => {
  it('should return new UUID instance', () => {
    const uuid = UUID.new()
    expect(uuid).toBeInstanceOf(UUID)
  })
  it('should return new UUID instance', () => {
    const uuid = UUID.of('123e4567-e89b-12d3-a456-426614174000')
    expect(uuid).toBeInstanceOf(UUID)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    const uuid = UUID.of('invalid') as InvalidParameterError
    expect(uuid.name).toEqual(InvalidParameterError.name)
    expect(uuid).toBeInstanceOf(Error)
  })
  it('should return new UUID instance', () => {
    const uuid = UUID.mustParse('123e4567-e89b-12d3-a456-426614174000')
    expect(uuid).toBeInstanceOf(UUID)
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    expect(() => UUID.mustParse('invalid')).toThrowError(Error)
  })
})
