import { repositoryClientMock } from '../mock/MockDBClient'
import { AttendeeRejoinUsecase } from './AttendeeRejoinUsecase'
import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockNotFound,
  attendeeQueryServiceMockError,
  teamQueryServiceMockSuccess,
  teamQueryServiceMockNotFound,
  teamQueryServiceMockError,
  pairQueryServiceMockSuccess,
  pairQueryServiceMockNotFound,
  pairQueryServiceMockError,
} from '../mock/MockQuery'
import {
  attendeeRepositoryMockSuccess,
  attendeeRepositoryMockError,
} from '../mock/MockRepository'
import { AttendeeMockData1, TeamCollectionMockData } from '../mock/MockData'
import {
  NoEffectiveOperationError,
  QueryError,
  QueryNotFoundError,
  RepositoryError,
  UnPemitedOperationError,
} from '../error/DomainError'
import { StatusConst as EnrollmentConst } from '../valueObject/EnrollmentStatus'
import { Attendee } from '../entity/Attendee'
import { PrahaRejoinAttendeeService } from '../service/PrahaRejoinAttendeeService'

describe('AttendeeRejoinUsecase', () => {
  const allSuccessUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeQueryErrorUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockError,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeNotFoundUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockNotFound,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const teamQueryErrorUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockError,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const teamNotFoundUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockNotFound,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const pairQueryErrorUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockError,
    attendeeRepositoryMockSuccess,
  )

  const pairNotFoundUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockNotFound,
    attendeeRepositoryMockSuccess,
  )

  const repositoryErrorUsecase = new AttendeeRejoinUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    attendeeRepositoryMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('exec', () => {
    test('正常系: 参加者の復帰成功', async () => {
      jest
        .spyOn(PrahaRejoinAttendeeService.prototype, 'addAttendee')
        .mockReturnValue(TeamCollectionMockData)
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const result = await attendeeQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('attendeeQueryServiceが参加者を見つけられない場合', async () => {
      const result = await attendeeNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toEqual(
        new QueryNotFoundError('指定された参加者は存在しません。'),
      )
    })

    test('teamQueryServiceがエラーを返す場合', async () => {
      const result = await teamQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('teamQueryServiceがチームを見つけられない場合', async () => {
      const result = await teamNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toEqual(
        new QueryNotFoundError('所属するチームが見つかりません。'),
      )
    })

    test('pairQueryServiceがエラーを返す場合', async () => {
      const result = await pairQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('pairQueryServiceがペアを見つけられない場合', async () => {
      const result = await pairNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toEqual(
        new QueryNotFoundError('所属するペアが見つかりません。'),
      )
    })

    test('PrahaRejoinAttendeeServiceがNoEffectiveOperationErrorを返す場合', async () => {
      jest
        .spyOn(PrahaRejoinAttendeeService.prototype, 'addAttendee')
        .mockReturnValue(new NoEffectiveOperationError(''))
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(NoEffectiveOperationError)
    })

    test('PrahaRejoinAttendeeServiceがUnPemitedOperationErrorを返す場合', async () => {
      jest
        .spyOn(PrahaRejoinAttendeeService.prototype, 'addAttendee')
        .mockReturnValue(new UnPemitedOperationError(''))
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(UnPemitedOperationError)
    })

    test('attendeeRepositoryがエラーを返す場合', async () => {
      jest
        .spyOn(PrahaRejoinAttendeeService.prototype, 'addAttendee')
        .mockReturnValue(TeamCollectionMockData)
      const result = await repositoryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.ENROLLMENT,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
