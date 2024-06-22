import { AttendeeCollection } from './AttendeeCollection'
import {
  AttendeeMockData1,
  AttendeeMockData2,
  AttendeeMockData3,
} from '@/domain/mock/MockData'
describe('AttendeeCollection', () => {
  it('should create an AttendeeCollection', () => {
    const attendees = AttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ])
    expect(attendees).toBeInstanceOf(AttendeeCollection)
    expect(attendees.length).toBe(3)
  })
  it('should regen an AttendeeCollection', () => {
    const attendees = AttendeeCollection.regen([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ])
    expect(attendees).toBeInstanceOf(AttendeeCollection)
    expect(attendees.length).toBe(3)
  })
  it('should add an attendee', () => {
    const attendees = AttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
    ])
    expect(attendees.length).toBe(2)
    const newAttendees = attendees.add(AttendeeMockData3)
    expect(newAttendees.length).toBe(3)
  })
  it('should delete an attendee', () => {
    const attendees = AttendeeCollection.create([
      AttendeeMockData1,
      AttendeeMockData2,
      AttendeeMockData3,
    ])
    expect(attendees.length).toBe(3)
    const newAttendees = attendees.delete(AttendeeMockData1)
    expect(newAttendees.length).toBe(2)
  })
})
