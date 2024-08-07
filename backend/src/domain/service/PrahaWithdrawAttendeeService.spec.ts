import { PrahaWithdrawAttendeeService } from './PrahaWithdrawAttendeeService'
import {
  PairAttendeeTooLessError,
  PairAttendeeTooManyError,
} from '../entity/collection/PairAttendeeCollection'
import { UnPemitedOperationError } from '../error/DomainError'
import { PairCollection } from '../entity/collection/PairCollection'
import {
  AttendeeMockData1,
  PairMockData1,
  PairMockData2,
  TeamCollectionMockData,
  TeamMockDataA,
} from '../mock/MockData'

describe('PrahaWithdrawAttendeeService', () => {
  const mockTeamCollection = TeamCollectionMockData
  const mockTeam = TeamMockDataA
  const mockPair = PairMockData1
  const mockAttendee = AttendeeMockData1

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('deleteAttendee', () => {
    const mockOnLessPairAlartAction = jest.fn()
    const mockOnUnableAllocateAction = jest.fn()

    it('should delete attendee from pair successfully', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)
      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair]))
      jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
      jest.spyOn(mockTeamCollection, 'find').mockReturnValue(mockTeam)
      jest.spyOn(mockPair, 'deleteAttendee').mockReturnValue(mockPair)
      jest.spyOn(mockTeam, 'replacePair').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeamCollection, 'replaceTeam')
        .mockReturnValue(mockTeamCollection)

      const result = service.deleteAttendee(
        mockAttendee,
        mockOnLessPairAlartAction,
        mockOnUnableAllocateAction,
      )

      expect(mockPair.deleteAttendee).toHaveBeenCalledWith(mockAttendee)
      expect(mockTeam.replacePair).toHaveBeenCalledWith(mockPair)
      expect(mockTeamCollection.replaceTeam).toHaveBeenCalledWith(mockTeam)
      expect(result).toBe(mockTeamCollection)
    })

    it('should return UnPemitedOperationError when attendee is not found in any pair', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([]))

      const result = service.deleteAttendee(
        mockAttendee,
        mockOnLessPairAlartAction,
        mockOnUnableAllocateAction,
      )

      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect((result as UnPemitedOperationError).message).toBe(
        '該当の参加者のチーム内のペアへの所属が確認できませんでした。',
      )
    })

    it('should return UnPemitedOperationError when team is not found', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair]))

      jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
      jest.spyOn(mockTeamCollection, 'find').mockReturnValue(undefined)

      const result = service.deleteAttendee(
        mockAttendee,
        mockOnLessPairAlartAction,
        mockOnUnableAllocateAction,
      )

      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect((result as UnPemitedOperationError).message).toBe(
        '該当の参加者のチームが確認できませんでした。',
      )
    })

    it('should auto allocate attendee when pair becomes too less', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair]))
      jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
      jest.spyOn(mockTeamCollection, 'find').mockReturnValue(mockTeam)
      jest
        .spyOn(mockPair, 'deleteAttendee')
        .mockReturnValue(new PairAttendeeTooLessError(''))

      const autoAllocateSpy = jest.spyOn(service as any, 'autoAlocateAttendee')
      autoAllocateSpy.mockReturnValue(mockPair)

      jest.spyOn(mockTeam, 'replacePair').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeamCollection, 'replaceTeam')
        .mockReturnValue(mockTeamCollection)

      const result = service.deleteAttendee(
        mockAttendee,
        mockOnLessPairAlartAction,
        mockOnUnableAllocateAction,
      )

      expect(mockOnLessPairAlartAction).toHaveBeenCalled()
      expect(autoAllocateSpy).toHaveBeenCalledWith(mockAttendee)
      expect(mockTeam.replacePair).toHaveBeenCalledWith(mockPair)
      expect(mockTeamCollection.replaceTeam).toHaveBeenCalledWith(mockTeam)
      expect(result).toBe(mockTeamCollection)
    })
  })

  describe('autoAlocateAttendee', () => {
    it('should auto allocate attendee to the least populated pair', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

      const autoAllocateAttendee = (service as any).autoAlocateAttendee.bind(
        service,
      )

      const mockOtherPair = PairMockData2
      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair, mockOtherPair]))
      jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
      jest.spyOn(mockTeamCollection, 'find').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeam.pairs, 'delete')
        .mockReturnValue(PairCollection.create([mockOtherPair]))
      jest.spyOn(mockOtherPair, 'addAttendee').mockReturnValue(mockOtherPair)

      const result = autoAllocateAttendee(mockAttendee)

      expect(mockOtherPair.addAttendee).toHaveBeenCalledWith(mockAttendee)
      expect(result).toBe(mockOtherPair)
    })

    // it('should return UnPemitedOperationError when no other pairs exist', () => {
    //   const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

    //   const autoAllocateAttendee = (service as any).autoAlocateAttendee.bind(
    //     service,
    //   )

    //   const mockOtherPair = PairMockData2
    //   jest
    //     .spyOn(mockTeamCollection, 'allPairs', 'get')
    //     .mockReturnValue(PairCollection.create([mockPair, mockOtherPair]))
    //   jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
    //   jest.spyOn(mockTeamCollection, 'find').mockReturnValue(mockTeam)
    //   jest
    //     .spyOn(mockTeam.pairs, 'delete')
    //     .mockReturnValue(PairCollection.create([]))
    //   jest.spyOn(mockOtherPair, 'addAttendee').mockReturnValue(mockOtherPair)
    //   const result = autoAllocateAttendee(mockAttendee)

    //   expect(result).toBeInstanceOf(UnPemitedOperationError)
    //   expect((result as UnPemitedOperationError).message).toBe(
    //     '他のペアが存在せず自動でペアを割り当てることができませんでした。',
    //   )
    // })

    it('should return UnPemitedOperationError when all pairs are too full', () => {
      const service = new PrahaWithdrawAttendeeService(mockTeamCollection)

      const autoAllocateAttendee = (service as any).autoAlocateAttendee.bind(
        service,
      )

      const mockOtherPair = PairMockData2
      jest
        .spyOn(mockTeamCollection, 'allPairs', 'get')
        .mockReturnValue(PairCollection.create([mockPair, mockOtherPair]))
      jest.spyOn(mockPair.attendees, 'has').mockReturnValue(true)
      jest.spyOn(mockTeamCollection, 'find').mockReturnValue(mockTeam)
      jest
        .spyOn(mockTeam.pairs, 'delete')
        .mockReturnValue(PairCollection.create([mockOtherPair]))
      jest
        .spyOn(mockOtherPair, 'addAttendee')
        .mockReturnValue(new PairAttendeeTooManyError(''))

      const result = autoAllocateAttendee(mockAttendee)

      expect(result).toBeInstanceOf(UnPemitedOperationError)
      expect((result as UnPemitedOperationError).message).toBe(
        '既にどのペアも参加者が多すぎるため、チームの中で最も最小のペアに参加者を自動で追加することができませんでした。',
      )
    })
  })
})
