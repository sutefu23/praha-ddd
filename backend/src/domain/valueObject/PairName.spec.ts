import { InvalidParameterError } from '../error/DomainError'
import { PairName } from './PairName'

describe('PairName', () => {
  it('should return new PairName instance', () => {
    const pairName = PairName.new('A')
    expect(pairName).toBeInstanceOf(PairName)
    expect((pairName as PairName).value).toBe('A')
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    const pairName = PairName.new('invalid') as InvalidParameterError
    expect(pairName).toBeInstanceOf(Error)
    expect(pairName.name).toBe(InvalidParameterError.name)
  })
  it('should return new PairName instance', () => {
    const pairName = PairName.mustParse('A')
    expect(pairName).toBeInstanceOf(PairName)
    expect(pairName.value).toBe('A')
  })
  it('should return new PairName instance', () => {
    const pairName = PairName.autoGenarate()
    expect(pairName).toBeInstanceOf(PairName)
    expect(pairName.value).toMatch(/^[A-Z]$/)
  })
  it('should return new PairName instance', () => {
    const pairName = PairName.mustParse('A')
    const nextPairName = pairName.getNextAlphabetPairName()
    expect(nextPairName).toBeInstanceOf(PairName)
    expect(nextPairName.value).toBe('B')
  })
})
