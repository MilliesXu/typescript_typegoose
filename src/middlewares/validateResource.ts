import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { ErrorType } from './errorHandler'

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    next()
  } catch (err: any) {
    const message = err.errors.map((error: ZodError) => error.message)
    const error = new Error(message)
    error.name = ErrorType['Validation Error'].toString()
    next(error)
  }
}

export default validateRequest
