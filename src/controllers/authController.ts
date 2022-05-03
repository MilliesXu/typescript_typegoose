import { NextFunction, Request, Response } from 'express'
import { CreateSessionInput } from '../schemas/authSchema'
import { findUserByEmail } from '../services/userService'
import { validatePassword, signAccessToken, signRefreshToken, refreshAccessToken } from '../services/authService'
import { get } from 'lodash'

export const createSessionHandler = async (req: Request<{}, {}, CreateSessionInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    await validatePassword(user, password)
    const accessToken = await signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id)

    res.send({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      verified: user.verified,
      accessToken,
      refreshToken
    })
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = err.name ? err.name : '500'
    next(error)
  }
}

export const refreshAccessTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = get(req, 'headers.x-refresh')
    const accessToken = await refreshAccessToken(refreshToken)

    res.send({ accessToken })
  } catch (err: any) {
    const error = new Error('Could not refresh access token')
    error.name = '401'
    next(error)
  }
}
