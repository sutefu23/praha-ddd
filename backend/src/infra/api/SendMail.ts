import { ActionError } from '@/domain/error/DomainError'
import { ISendMailAction } from '@/domain/interface/ISendMailAction'
import { SMTPClient } from 'smtp-client'
export class SendMailAction implements ISendMailAction<SMTPClient> {
  public async sendToAdmin(
    client: SMTPClient,
    subject: string,
    body: string,
  ): Promise<void | ActionError> {
    // 本来はメール送信処理を書く
    try {
      await client.connect()
      await client.greet({ hostname: 'example.com' })
      await client.authPlain({ username: 'user', password: 'password' })
      await client.mail({ from: '' })
      await client.rcpt({ to: '' })
      await client.data(`Subject: ${subject}\n\n${body}`)
    } catch (e) {
      if (e instanceof Error) {
        return new ActionError(e.message)
      }
    } finally {
      await client.quit()
    }
  }
}
