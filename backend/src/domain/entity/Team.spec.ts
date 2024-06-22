import { TeamName } from '../valueObject/TeamName'
import {
  AttendeeCollectionMockData,
  AttendeeMockData1,
  PairMockData1,
  PairMockData2,
  PairMockData3,
} from '../mock/MockData'
import { Team } from './Team'
import { PairCollection } from './collection/PairCollection'
import { UnPemitedOperationError } from '../error/DomainError'
import { Pair } from './Pair'
import { PairName } from '../valueObject/PairName'
import { AttendeeCollection } from './collection/AttendeeCollection'

describe('Team', () => {
  it('should create a team', () => {
    const pairs = PairCollection.create([
      PairMockData1,
      PairMockData2,
      PairMockData3,
    ])
    const teamName = TeamName.mustParse('A')
    const team = Team.create({ name: teamName, pairs })
    expect(team).toBeInstanceOf(Team)
  })
  it('should return UnPemitedOperationError error', () => {
    const pair = Pair.create({
      name: PairName.mustParse('1'),
      attendees: AttendeeCollection.regen([AttendeeMockData1]), // 敢えて参加者が1人だけのペア
    }) as Pair
    const pairs = PairCollection.create([pair])
    const teamName = TeamName.mustParse('A')
    const team = Team.create({ name: teamName, pairs })
    expect(team).toBeInstanceOf(Error)
    expect(team.name).toBe(UnPemitedOperationError.name)
  })

  it('should add a pair', () => {
    const teamName = TeamName.mustParse('C')
    const pairs = PairCollection.create([
      PairMockData1,
      PairMockData2,
      PairMockData3,
    ])
    const PairMockData4 = Pair.create({
      name: PairName.mustParse('4'),
      attendees: AttendeeCollectionMockData,
    }) as Pair
    const team = Team.create({ name: teamName, pairs: pairs }) as Team
    expect(team.pairs.length).toBe(3)
    const newTeam = team.addPair(PairMockData4)
    expect(newTeam.pairs.length).toBe(4)
    expect(newTeam.pairs[3]?.name.value).toBe('4')
  })
  it('should delete a pair', () => {
    const teamName = TeamName.mustParse('D')
    const pairs = PairCollection.create([
      PairMockData1,
      PairMockData2,
      PairMockData3,
    ])
    const team = Team.create({ name: teamName, pairs: pairs }) as Team
    expect(team.pairs.length).toBe(3)
    const newTeam = team.deletePair(PairMockData1)
    expect(newTeam.pairs.length).toBe(2)
    expect(newTeam.pairs[0]?.name.value).toBe('2')
  })
})
