import { SMTPClient } from 'smtp-client'

export const sendMailClient = new SMTPClient({
  host: 'smtp.example.com',
  port: 465,
})
