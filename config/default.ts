import 'dotenv/config'

export default {
  port: parseInt(process.env.PORT as string) || 5000,
  mongo_uri: process.env.MONGO_URI as string,
  node_env: process.env.NODE_ENV as string,
  // This smtp for testing purpose
  smtp: {
    user: 'otkzwvtmow33nb76@ethereal.email',
    pass: 'h1brCb4X1HTEG2DKZ1',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false
  },
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY as string,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY as string
}
