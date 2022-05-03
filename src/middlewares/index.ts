import { Express } from 'express'
import errorHandler from './errorHandler'

export default function (app: Express) {
  app.use(errorHandler)
}
