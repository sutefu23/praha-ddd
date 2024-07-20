import { repositoryClientMock } from '../mock/MockDBClient'
import { mailClientMock } from '../mock/MockMailClient'
import { AttendeeWithdrawUsecase } from './AttendeeWithdrawUsecase'
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
import {
  sendMailActionMockSuccess,
  sendMailActionMockError,
} from '../mock/MockSendMailAction'
import { AttendeeMockData1 } from '../mock/MockData'
import {
  QueryError,
  QueryNotFoundError,
  RepositoryError,
} from '../error/DomainError'
import { StatusConst as EnrollmentConst } from '../valueObject/EnrollmentStatus'
import { Attendee } from '../entity/Attendee'
import { PrahaWithdrawAttendeeService } from '../service/PrahaWithdrawAttendeeService'

describe('AttendeeWithdrawUsecase', () => {
  const allSuccessUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeQueryErrorUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockError,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const attendeeNotFoundUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockNotFound,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const teamQueryErrorUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockError,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const teamNotFoundUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockNotFound,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const pairQueryErrorUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockError,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const pairNotFoundUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockNotFound,
    sendMailActionMockSuccess,
    attendeeRepositoryMockSuccess,
  )

  const sendMailErrorUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockError,
    attendeeRepositoryMockSuccess,
  )

  const repositoryErrorUsecase = new AttendeeWithdrawUsecase(
    repositoryClientMock,
    mailClientMock,
    attendeeQueryServiceMockSuccess,
    teamQueryServiceMockSuccess,
    pairQueryServiceMockSuccess,
    sendMailActionMockSuccess,
    attendeeRepositoryMockError,
  )

  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  describe('exec', () => {
    test('正常系: 参加者の退会成功', async () => {
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('正常系: 参加者の休会成功', async () => {
      const result = await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.TEMPORARY_ABSENCE,
      )
      expect(result).toBeInstanceOf(Attendee)
    })

    test('attendeeQueryServiceがエラーを返す場合', async () => {
      const result = await attendeeQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('attendeeQueryServiceが参加者を見つけられない場合', async () => {
      const result = await attendeeNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toEqual(
        new QueryNotFoundError('指定された参加者は存在しません。'),
      )
    })

    test('teamQueryServiceがエラーを返す場合', async () => {
      const result = await teamQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('teamQueryServiceがチームを見つけられない場合', async () => {
      const result = await teamNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toEqual(
        new QueryNotFoundError('所属するチームが見つかりません。'),
      )
    })

    test('pairQueryServiceがエラーを返す場合', async () => {
      const result = await pairQueryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toBeInstanceOf(QueryError)
    })

    test('pairQueryServiceがペアを見つけられない場合', async () => {
      const result = await pairNotFoundUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toEqual(
        new QueryNotFoundError('所属するペアが見つかりません。'),
      )
    })
    test('メールを発火', async () => {
      const mockDeleteAttendee = jest.fn()
      jest
        .spyOn(PrahaWithdrawAttendeeService.prototype, 'deleteAttendee')
        .mockImplementation(mockDeleteAttendee)

      await allSuccessUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )

      const [, callback1, callback2] = mockDeleteAttendee.mock.calls[0]

      // テストコールバック1
      callback1()
      expect(sendMailActionMockSuccess.sendToAdmin).toHaveBeenCalledWith(
        mailClientMock,
        expect.stringContaining('さんがペアを辞めました。'),
        expect.stringContaining('在籍ステータス'),
      )

      // // テストコールバック2
      callback2()
      expect(sendMailActionMockSuccess.sendToAdmin).toHaveBeenCalledWith(
        mailClientMock,
        expect.stringContaining('自動割当が出来ません。'),
        expect.stringContaining('手動で割り当ててください。'),
      )
    })

    test('attendeeRepositoryがエラーを返す場合', async () => {
      const result = await repositoryErrorUsecase.exec(
        AttendeeMockData1.id,
        EnrollmentConst.WITHDRAWAL,
      )
      expect(result).toBeInstanceOf(RepositoryError)
    })
  })
})
