import express from 'express'
import config from 'config'
import { log } from './utils/logger'
import { connectDB } from './utils/connectDB'
import routes from './routes'
import middlewares from './middlewares'

const port = config.get<number>('port')

const app = express()

app.use(express.json())

app.listen(port, () => {
  log.info(`Server running on port ${port}`)
  connectDB()
  routes(app)
  middlewares(app)
})
