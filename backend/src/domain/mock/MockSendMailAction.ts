import { ActionError } from '../error/DomainError'
import { ISendMailAction } from '../interface/ISendMailAction'
export const sendMailActionMockSuccess: ISendMailAction = {
  sendToAdmin: jest.fn().mockResolvedValue(undefined),
}
export const sendMailActionMockError: ISendMailAction = {
  sendToAdmin: jest.fn().mockResolvedValue(new ActionError('reason')),
}
