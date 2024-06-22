import { PairName } from '../valueObject/PairName'

import { AttendeeCollectionMockData, AttendeeMockData1 } from '../mock/MockData'
import { Pair } from './Pair'

describe('Pair', () => {
  it('ペアを作成できる', () => {
    const name = PairName.mustParse('1')
    const attendees = AttendeeCollectionMockData
    const pair = Pair.create({
      name,
      attendees,
    })
    expect(pair).toBeInstanceOf(Pair)
  })
  it('ペアに参加者を追加できる', () => {
    const name = PairName.mustParse('1')
    const attendees = AttendeeCollectionMockData
    const pair = Pair.create({
      name,
      attendees,
    }) as Pair
    const newAttendee = AttendeeMockData1
    const addedPair = pair.addAttendee(newAttendee)
    expect((addedPair as Pair).attendees.length).toBe(4)
  })
  it('ペアから参加者を削除できる', () => {
    const name = PairName.mustParse('1')
    const attendees = AttendeeCollectionMockData
    expect(attendees.length).toBe(3)
    const pair = Pair.create({
      name,
      attendees,
    }) as Pair
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const deletedPair = pair.deleteAttendee(attendees[0]!)
    expect((deletedPair as Pair).attendees.length).toBe(2)
  })
})
