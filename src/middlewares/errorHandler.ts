import { Request, Response, NextFunction } from 'express'
import config from 'config'

export enum ErrorType {
  'Internal Error' = 500,
  'Validation Error' = 400,
  'Unauthorized Error' = 401,
  'Forbidden Error' = 403,
  'Not Found Error' = 404
}

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = err
  const code: number = parseInt(error.name)
  const environment = config.get('node_env')

  res.status(code).send({ 
    message: error.message,
    stack: environment === 'development' ? error.stack : null
  })
}

export default errorHandler
