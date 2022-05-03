import nodemailer, { SendMailOptions } from 'nodemailer'
import config from 'config'
import { ErrorType } from '../middlewares/errorHandler'
import { log } from './logger'

// const createTestCreds = async () => {
//   const creds = await nodemailer.createTestAccount()
//   log.info(creds)
// }

// createTestCreds()

const smtp = config.get<{
  user: string,
  pass: string,
  host: string,
  port: number,
  secure: boolean
}>('smtp')

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass
  }
})

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      const error = new Error(`${err}, Error sending email`)
      error.name = ErrorType['Internal Error'].toString()
      throw error
    }

    log.info(`Preview url: ${nodemailer.getTestMessageUrl(info)}`)
  })
}

export default sendEmail
