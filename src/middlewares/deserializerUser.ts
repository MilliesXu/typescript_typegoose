import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'

const deserializerUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')

  if (!accessToken) {
    const error = new Error('Unauthorized')
    error.name = '401'
    return next(error)
  }

  const decoded = verifyJWT(accessToken, 'accessTokenPublicKey')

  if (!decoded) {
    const error = new Error('Unauthorized')
    error.name = '401'
    return next(error)
  }

  if (decoded) res.locals.user = decoded

  return next()
}

export default deserializerUser
