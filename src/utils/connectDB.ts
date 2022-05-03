import mongoose from 'mongoose'
import config from 'config'
import { log } from './logger'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.get<string>('mongo_uri'))

    log.info(`Successfully connect to database ${conn.connection.host}`)
  } catch (error: any) {
    log.error(error)
    process.exit(1)
  }
}
