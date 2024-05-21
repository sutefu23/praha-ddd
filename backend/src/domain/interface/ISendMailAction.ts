import { ActionError } from '../error/DomainError'
// 外部APIを呼び出すためのインターフェース
export interface ISendMailAction<ClientType = unknown> {
  sendToAdmin: (
    client: ClientType,
    subject: string,
    body: string,
  ) => Promise<void | ActionError>
}
