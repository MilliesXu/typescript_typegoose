import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/userModel'
import { } from '../schemas/userSchema'
import { nanoid } from 'nanoid'

export const createUser = async (input: Partial<User>) => {
  return await UserModel.create(input)
}

export const findUserById = async (id: string): Promise<DocumentType<User>> => {
  try {
    const user = await UserModel.findById(id)

    if (!user) {
      throw new Error()
    }

    return user
  } catch (err: any) {
    const error = new Error('Could not verify user')
    error.name = '404'
    throw error
  }
}

export const verifiyUser = async (user: DocumentType<User>, verificationCode: string) => {
  if (user.verified) {
    if (user.verificationCode === verificationCode) {
      user.verified = true

      await user.save()

      return user
    } else {
      const error = new Error('Could not verify user')
      error.name = '400'
      throw error
    }
  } else {
    const error = new Error('Could not verify user')
    error.name = '400'
    throw error
  }
}

export const findUserByEmail = async (email: string): Promise<DocumentType<User>> => {
  try {
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new Error()
    }

    return user
  } catch (err: any) {
    const error = new Error('Invalid email or password')
    error.name = '404'
    throw error
  }
}

export const updatePasswordResetCode = async (user: DocumentType<User>) => {
  try {
    if (!user.verified) {
      const error = new Error('User is not verified')
      error.name = '400'
      throw error
    }

    const passwordResetCode = nanoid()

    user.passwordResetCode = passwordResetCode

    await user.save()

    return user
  } catch (err: any) {
    const error = new Error(err.message ? err.message : 'Failed to send verification email')
    error.name = err.name ? err.name : '400'
    throw error
  }
}

export const resetUserPassword = async (user: DocumentType<User>, passwordResetCode: string, password: string) => {
  try {
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      throw new Error()
    }

    user.passwordResetCode = null
    user.password = password

    await user.save()

    return user
  } catch (err: any) {
    const error = new Error('Cannot reset your password')
    error.name = '400'
    throw error
  }
}
