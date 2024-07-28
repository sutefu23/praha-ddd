import { AttendeeModifyStatusUsecase } from './AttendeeModifyStatusUsecase'

import {
  attendeeQueryServiceMockSuccess,
  attendeeQueryServiceMockNotFound,
  attendeeQueryServiceMockError,
  teamQueryServiceMockSuccess,
  pairQueryServiceMockSuccess,
} from '../mock/MockQuery'

import {
  attendeeRepositoryMockSuccess,
  attendeeRepositoryMockError,
} from '../mock/MockRepository'

import { sendMailActionMockSuccess } from '../mock/MockSendMailAction'
import { AttendeeMockData1 } from '../mock/MockData'
import {
  QueryError,
  QueryNotFoundError,
  NoEffectiveOperationError,
  InvalidParameterError,
  RepositoryError,
} from '../error/DomainError'
import {
  StatusConst as EnrollmentStatusConst,
  EnrollmentStatus,
} from '../valueObject/EnrollmentStatus'
import { Attendee } from '../entity/Attendee'

describe('AttendeeModifyStatusUsecase', () => {
  const allSuccessUsecase = new AttendeeModifyStatusUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeQueryErrorUsecase = new AttendeeModifyStatusUsecase(
    attendeeQueryServiceMockError,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeQueryNotFoundUsecase = new AttendeeModifyStatusUsecase(
    attendeeQueryServiceMockNotFound,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeRepositoryErrorUsecase = new AttendeeModifyStatusUsecase(
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('exec', () => {
    test('正常系: ステータス変更成功', async () => {
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const result = await attendeeQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toEqual(new QueryError('reason'))
    })

    test('attendeeQueryServiceがnullを返す場合', async () => {
      const result = await attendeeQueryNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toEqual(
        new QueryNotFoundError('指定された参加者が存在しません'),
      )
    })

    test('退会済みの参加者のステータス変更を試みた場合', async () => {
      const withdrawnAttendee = Attendee.regen({
        id: AttendeeMockData1.id,
        name: AttendeeMockData1.name,
        email: AttendeeMockData1.email,
        enrollment_status: EnrollmentStatus.mustParse(
          EnrollmentStatusConst.WITHDRAWAL,
        ),
      })
      jest
        .spyOn(attendeeQueryServiceMockSuccess, 'findAttendeeById')
        .mockResolvedValue(withdrawnAttendee)
      const result = await allSuccessUsecase.exec(
        withdrawnAttendee.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toEqual(
        new InvalidParameterError(
          '退会済みの参加者のステータス変更はできません',
        ),
      )
    })

    test('退会処理の場合', async () => {
      jest
        .spyOn(attendeeQueryServiceMockSuccess, 'findAttendeeById')
        .mockResolvedValue(AttendeeMockData1)
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.WITHDRAWAL),
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('休会処理の場合', async () => {
      jest
        .spyOn(attendeeQueryServiceMockSuccess, 'findAttendeeById')
        .mockResolvedValue(AttendeeMockData1)

      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.TEMPORARY_ABSENCE),
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('復会処理の場合', async () => {
      jest
        .spyOn(attendeeQueryServiceMockSuccess, 'findAttendeeById')
        .mockResolvedValue(AttendeeMockData1)

      const temporaryAbsenceAttendee = Attendee.regen({
        id: AttendeeMockData1.id,
        name: AttendeeMockData1.name,
        email: AttendeeMockData1.email,
        enrollment_status: EnrollmentStatus.mustParse(
          EnrollmentStatusConst.TEMPORARY_ABSENCE,
        ),
      })
      const result = await allSuccessUsecase.exec(
        temporaryAbsenceAttendee.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('attendeeRepositoryがエラーを返す場合', async () => {
      jest
        .spyOn(attendeeQueryServiceMockSuccess, 'findAttendeeById')
        .mockResolvedValue(AttendeeMockData1)

      const result = await attendeeRepositoryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentStatus.mustParse(EnrollmentStatusConst.ENROLLMENT),
      )
      expect(result).toEqual(new RepositoryError('reason'))
    })
  })
})
