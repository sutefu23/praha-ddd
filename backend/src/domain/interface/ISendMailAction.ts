import { ActionError } from '../error/DomainError'
// 外部APIを呼び出すためのインターフェース
export interface ISendMailAction {
  client: unknown
  sendToAdmin: (subject: string, body: string) => Promise<void | ActionError>
}
