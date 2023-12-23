import { ActionError } from '../error/DomainError'
// 外部APIを呼び出すためのインターフェース
// 命名はxxClientとかでもOK
export interface ISendMailAction {
  sendToAdmin: (subject: string, body: string) => Promise<void | ActionError>
}
