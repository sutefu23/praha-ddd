import { InvalidParameterError } from '../error/DomainError'
import { TeamName } from './TeamName'

describe('TeamName', () => {
  it('should return new TeamName instance', () => {
    const teamName = TeamName.new('1')
    expect(teamName).toBeInstanceOf(TeamName)
    expect((teamName as TeamName).value).toBe('1')
  })
  it('should return InvalidParameterError when invalid value is passed', () => {
    const teamName1 = TeamName.new('invalid') as InvalidParameterError
    expect(teamName1.name).toBe(InvalidParameterError.name)
    expect(teamName1).toBeInstanceOf(Error)
    const teamName2 = TeamName.new('123456') as InvalidParameterError
    expect(teamName2.name).toBe(InvalidParameterError.name)
    expect(teamName2).toBeInstanceOf(Error)
  })
  it('should return new TeamName instance', () => {
    const teamName = TeamName.mustParse('2')
    expect(teamName).toBeInstanceOf(TeamName)
    expect(teamName.value).toBe('2')
  })
})
