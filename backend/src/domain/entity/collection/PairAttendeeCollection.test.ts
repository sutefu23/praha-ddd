import {
  PairAttendeeCollection,
  PairAttendeeTooLessError,
  PairAttendeeTooManyError,
} from './PairAttendeeCollection'
import {
  AttendeeMockData1,
  AttendeeMockData2,
  AttendeeMockData3,
} from '@/domain/mock/MockData'
describe('PairAttendeeCollection', () => {
  it('should create an PairAttendeeCollection', () => {
    const pairs = PairAttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ]) as PairAttendeeCollection
    expect(pairs).toBeInstanceOf(PairAttendeeCollection)
    expect(pairs.length).toBe(3)
  })
  it('should regen an PairAttendeeCollection', () => {
    const pairs = PairAttendeeCollection.regen([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ])
    expect(pairs).toBeInstanceOf(PairAttendeeCollection)
    expect(pairs.length).toBe(3)
  })
  it('should throw PairAttendeeTooManyError', () => {
    const ToomanyPairs = PairAttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
      AttendeeMockData1,
      AttendeeMockData2,
    ]) as PairAttendeeTooManyError
    expect(ToomanyPairs).toBeInstanceOf(Error)
    expect(ToomanyPairs.name).toBe('PairAttendeeTooManyError')
  })
  it('should add an attendee', () => {
    const pairs = PairAttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
    ]) as PairAttendeeCollection
    expect(pairs.length).toBe(2)
    const newPairs = pairs.add(AttendeeMockData3) as PairAttendeeCollection
    expect(newPairs.length).toBe(3)
  })
  it('should delete an attendee', () => {
    const pairs = PairAttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ]) as PairAttendeeCollection
    expect(pairs.length).toBe(3)
    const newPairs = pairs.delete(AttendeeMockData1) as PairAttendeeCollection
    expect(newPairs.length).toBe(2)
  })
  it('should delete throw PairAttendeeTooLessError', () => {
    const pairs = PairAttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
    ]) as PairAttendeeCollection
    expect(pairs.length).toBe(2)
    const newPairs = pairs.delete(AttendeeMockData1) as PairAttendeeTooLessError
    expect(newPairs).toBeInstanceOf(Error)
    expect(newPairs.name).toBe('PairAttendeeTooLessError')
  })
})
