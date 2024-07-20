import { PrahaRejoinAttendeeService } from './PrahaRejoinAttendeeService'
import { Attendee } from '../entity/Attendee'
import { Team } from '../entity/Team'
import { Pair } from '../entity/Pair'
import { TeamCollection } from '../entity/collection/TeamCollection'
import { AttendeeCollection } from '../entity/collection/AttendeeCollection'
import {
  InvalidParameterError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { PairAttendeeTooManyError } from '../entity/Pair'
import {
  AttendeeMockData1,
  AttendeeMockData2,
  AttendeeMockData3,
  AttendeeMockData4,
} from '../mock/MockData'
import { PairCollection } from '../entity/collection/PairCollection'
import { PairName } from '../valueObject/PairName'

describe('PrahaRejoinAttendeeService', () => {
  let service: PrahaRejoinAttendeeService
  let mockTeamCollection: jest.Mocked<TeamCollection>
  let mockTeam: jest.Mocked<Team>
  let mockPair: jest.Mocked<Pair>
  let mockAttendee: Attendee

  beforeEach(() => {
    mockTeamCollection = {
      replaceTeam: jest.fn(),
      allPairs: [],
    } as any
    mockTeam = {
      pairs: [],
      replacePair: jest.fn(),
      addPair: jest.fn(),
    } as any
    mockPair = {
      attendees: [],
      addAttendee: jest.fn(),
      name: { value: 'A', getNextAlphabetPairName: jest.fn() },
    } as any
    mockAttendee = {} as Attendee

    service = new PrahaRejoinAttendeeService(mockTeamCollection)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
  describe('addAttendee', () => {
    it('should add attendee to the smallest pair in the smallest team', () => {
      mockTeamCollection[0] = mockTeam
      jest
        .spyOn(mockTeam, 'pairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair]))
      jest.spyOn(mockPair, 'addAttendee').mockReturnValue(mockPair)
      jest.spyOn(mockTeam, 'replacePair').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeamCollection, 'replaceTeam')
        .mockReturnValue(mockTeamCollection)

      const result = service.addAttendee(mockAttendee)

      expect(mockPair.addAttendee).toHaveBeenCalledWith(mockAttendee)
      expect(mockTeam.replacePair).toHaveBeenCalledWith(mockPair)
      expect(mockTeamCollection.replaceTeam).toHaveBeenCalledWith(mockTeam)
      expect(result).toBe(mockTeamCollection)
    })

    it('should return UnPemitedOperationError when no teams exist', () => {
      const result = service.addAttendee(mockAttendee)

      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect((result as UnPemitedOperationError).message).toBe(
        'チームが存在せず自動で増員を割り当てることができませんでした。',
      )
    })

    it('should return UnPemitedOperationError when no pairs exist', () => {
      mockTeamCollection[0] = mockTeam
      jest
        .spyOn(mockTeam, 'pairs', 'get')
        .mockReturnValue(PairCollection.create([]))

      const result = service.addAttendee(mockAttendee)

      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect((result as UnPemitedOperationError).message).toBe(
        'ペアが存在せず自動でペアを割り当てることができませんでした。',
      )
    })

    it('should split pair when PairAttendeeTooManyError occurs', () => {
      mockTeamCollection[0] = mockTeam
      jest
        .spyOn(mockTeam, 'pairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair]))

      jest
        .spyOn(mockPair, 'addAttendee')
        .mockReturnValue(new PairAttendeeTooManyError(''))

      const splitPairSpy = jest.spyOn(service as any, 'splitPair')
      splitPairSpy.mockReturnValue([mockPair, mockPair])

      jest.spyOn(mockTeam, 'replacePair').mockReturnValue(mockTeam)
      jest.spyOn(mockTeam, 'addPair').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeamCollection, 'replaceTeam')
        .mockReturnValue(mockTeamCollection)

      const result = service.addAttendee(mockAttendee)

      expect(splitPairSpy).toHaveBeenCalledWith(mockPair)
      expect(mockTeam.replacePair).toHaveBeenCalled()
      expect(mockTeam.addPair).toHaveBeenCalled()
      expect(mockTeamCollection.replaceTeam).toHaveBeenCalledWith(mockTeam)
      expect(result).toBe(mockTeamCollection)
    })
  })

  describe('splitPair', () => {
    it('should split pair correctly', () => {
      const splitPair = service['splitPair'].bind(service)

      const mockAttendees = [
        AttendeeMockData1,
        AttendeeMockData2,
        AttendeeMockData3,
        AttendeeMockData4,
      ]

      const mockPair = Pair.create({
        name: PairName.mustParse('A'),
        attendees: mockAttendees,
      }) as Pair

      jest
        .spyOn(AttendeeCollection, 'create')
        .mockReturnValue(new AttendeeCollection(mockAttendees.slice(2)))
      jest.spyOn(Pair, 'regen').mockReturnValue(mockPair)
      jest
        .spyOn(mockPair.name, 'getNextAlphabetPairName')
        .mockReturnValue(PairName.mustParse('B'))
      jest.spyOn(Pair, 'create').mockReturnValue(mockPair)

      const result = splitPair(mockPair)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(Pair.regen).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pair1',
          name: mockPair.name,
          attendees: expect.any(AttendeeCollection),
        }),
      )
      expect(Pair.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'B',
          attendees: expect.any(Array),
        }),
      )
    })

    it('should return InvalidParameterError when no pairs exist', () => {
      const splitPair = service['splitPair'].bind(service)

      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([]))

      const result = splitPair(mockPair)

      expect(result).toBeInstanceOf(InvalidParameterError)
      expect((result as InvalidParameterError).message).toBe(
        '分割すべきペアが存在しません',
      )
    })
  })
})
