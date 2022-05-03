import jwt from 'jsonwebtoken'
import config from 'config'

export const signInJWT = (object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) => {
  const signInKey = config.get<string>(keyName)

  return jwt.sign(object, signInKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

export const verifyJWT = (token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey') => {
  const publicKey = config.get<string>(keyName)
  try {
    const decoded = jwt.verify(token, publicKey)

    return decoded
  } catch (err: any) {
    return null
  }
}
