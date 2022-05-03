import { DocumentType } from '@typegoose/typegoose'
import SessionModel from '../models/sessionModel'
import { User } from '../models/userModel'
import { signInJWT, verifyJWT } from '../utils/jwt'
import { get } from 'lodash'
import { findUserById } from './userService'

export const createSession = async (userId: string) => {
  try {
    let session = await SessionModel.findOne({ user: userId, valid: true })

    if (!session) session = await SessionModel.create({ user: userId })

    return session
  } catch (err: any) {
    throw new Error(err)
  }
}

export const validatePassword = async (user: DocumentType<User>, password: string) => {
  try {
    if (!user.verified) {
      if (!user.verified) {
        const error = new Error('User is not verified')
        error.name = '400'
        throw error
      }
    }

    const isValid = await user.validationPassword(password)

    if (!isValid) {
      const error = new Error('Invalid email or password')
      error.name = '400'
      throw error
    }
  } catch (err: any) {
    const error = new Error(err.message ? err.message : 'Failed to send verification email')
    error.name = err.name ? err.name : '400'
    throw error
  }
}

export const signAccessToken = async (user: DocumentType<User>) => {
  const accessToken = signInJWT({
    userId: user._id
  }, 'accessTokenPrivateKey')

  return accessToken
}

export const signRefreshToken = async ({ _id }: {_id: string}) => {
  try {
    const session = await createSession(_id)
    const refreshToken = signInJWT({
      session: session._id
    }, 'refreshTokenPrivateKey')
    return refreshToken
  } catch (err: any) {
    throw new Error(err)
  }
}

const findSessionById = async (id: string) => {
  return await SessionModel.findById(id)
}

export const refreshAccessToken = async (token: string) => {
  const decoded = verifyJWT(token, 'refreshTokenPublicKey')

  if (!decoded) throw new Error()

  const session = await findSessionById(get(decoded, 'session'))

  if (!session || !session.valid) throw new Error()

  const user = await findUserById(String(session.user))

  if (!user) throw new Error()

  const accessToken = signAccessToken(user)

  return accessToken
}
