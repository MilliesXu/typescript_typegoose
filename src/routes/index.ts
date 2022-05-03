import { Express } from 'express'

import userRoute from './userRoute'
import authRoute from './authRoute'

export default (app: Express) => {
  app.use('/api/user', userRoute)
  app.use('/api/session', authRoute)
}
