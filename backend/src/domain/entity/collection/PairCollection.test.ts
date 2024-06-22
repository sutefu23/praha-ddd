import { PairCollection } from './PairCollection'
import {
  PairMockData1,
  PairMockData2,
  PairMockData3,
} from '@/domain/mock/MockData'
describe('PairCollection', () => {
  it('should create an PairCollection', () => {
    const pairs = PairCollection.create([
      PairMockData1,
      PairMockData2,
      PairMockData3,
    ])
    expect(pairs).toBeInstanceOf(PairCollection)
    expect(pairs.length).toBe(3)
  })
  it('should add an attendee', () => {
    const pairs = PairCollection.create([PairMockData1, PairMockData2])
    expect(pairs.length).toBe(2)
    const newPairs = pairs.add(PairMockData3)
    expect(newPairs.length).toBe(3)
  })
  it('should delete an attendee', () => {
    const pairs = PairCollection.create([
      PairMockData1,
      PairMockData2,
      PairMockData3,
    ])
    expect(pairs.length).toBe(3)
    const newPairs = pairs.delete(PairMockData1)
    expect(newPairs.length).toBe(2)
  })
})
