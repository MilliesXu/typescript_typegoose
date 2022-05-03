import { NextFunction, Request, Response } from 'express'
import { CreateUserInput, VerifyUserInput, ForgotPasswordInput, ResetPasswordInput } from '../schemas/userSchema'
import { ErrorType } from '../middlewares/errorHandler'
import { createUser, findUserById, findUserByEmail, verifiyUser, updatePasswordResetCode, resetUserPassword } from '../services/userService'
import { omit } from 'lodash'
import { userPrivateFields } from '../models/userModel'
import sendEmail from '../utils/mailer'

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body

    const user = await createUser(body)

    await sendEmail({
      from: 'test@email.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `Verification code ${user.verificationCode}, Id : ${user._id}`
    })

    res.send({ message: 'Verification email has been sent' })
  } catch (err: any) {
    const error = new Error(err)
    error.name = err.code === 11000 ? '409' : ErrorType['Internal Error'].toString()
    next(error)
  }
}

export const verifyUserHandler = async (req: Request<VerifyUserInput>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const verificationCode = req.params.verificationCode

    const user = await findUserById(id)
    const verifiedUser = await verifiyUser(user, verificationCode)

    res.send(omit(verifiedUser.toJSON(), userPrivateFields))
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = err.name ? err.name : '500'
    next(error)
  }
}

export const forgotPasswordHandler = async (req: Request<{}, {}, ForgotPasswordInput>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const user = await findUserByEmail(email)

    const updateUser = await updatePasswordResetCode(user)

    await sendEmail({
      from: 'test@email.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `Password Reset Code ${updateUser.passwordResetCode}, Id : ${updateUser._id}`
    })

    res.send({ message: 'Verification email has been sent' })
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = err.name ? err.name : '500'
    next(error)
  }
}

export const resetPasswordHandler = async (req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response, next: NextFunction) => {
  try {
    const { id, passwordResetCode } = req.params
    const { password } = req.body

    const user = await findUserById(id)

    const userUpdated = await resetUserPassword(user, passwordResetCode, password)

    res.send(omit(userUpdated.toJSON(), userPrivateFields))
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = err.name ? err.name : '500'
    next(error)
  }
}

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(res.locals.user.userId)

    res.send(omit(user.toJSON(), userPrivateFields))
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = err.name ? err.name : '500'
    next(error)
  }
}
