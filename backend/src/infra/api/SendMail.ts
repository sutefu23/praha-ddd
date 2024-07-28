import { ActionError } from '@/domain/error/DomainError'
import { ISendMailAction } from '@/domain/interface/ISendMailAction'
import { SMTPClient } from 'smtp-client'
export class SendMailAction implements ISendMailAction {
  constructor(public client: SMTPClient) {}
  public async sendToAdmin(
    subject: string,
    body: string,
  ): Promise<void | ActionError> {
    // 本来はメール送信処理を書く
    try {
      await this.client.connect()
      await this.client.greet({ hostname: 'example.com' })
      await this.client.authPlain({ username: 'user', password: 'password' })
      await this.client.mail({ from: '' })
      await this.client.rcpt({ to: '' })
      await this.client.data(`Subject: ${subject}\n\n${body}`)
    } catch (e) {
      if (e instanceof Error) {
        return new ActionError(e.message)
      }
    } finally {
      await this.client.quit()
    }
  }
}
