import { TeamCollection } from './TeamCollection'
import {
  TeamMockDataA,
  TeamMockDataB,
  TeamMockDataC,
} from '../../mock/MockData'
describe('TeamCollection', () => {
  it('should create an TeamCollection', () => {
    const teams = TeamCollection.create([
      TeamMockDataA,
      TeamMockDataB,
      TeamMockDataC,
    ])
    expect(teams).toBeInstanceOf(TeamCollection)
    expect(teams.length).toBe(3)
  })
  it('should add an attendee', () => {
    const teams = TeamCollection.create([TeamMockDataA, TeamMockDataB])
    expect(teams.length).toBe(2)
    const newTeams = teams.add(TeamMockDataC)
    expect(newTeams.length).toBe(3)
  })
  it('should delete an attendee', () => {
    const teams = TeamCollection.create([
      TeamMockDataA,
      TeamMockDataB,
      TeamMockDataC,
    ])
    expect(teams.length).toBe(3)
    const newTeams = teams.delete(TeamMockDataA)
    expect(newTeams.length).toBe(2)
  })
})
