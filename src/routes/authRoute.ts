import express from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../controllers/authController'
import validateRequest from '../middlewares/validateResource'
import { createSessionSchema } from '../schemas/authSchema'

const authRoute = express.Router()

authRoute.post('/', validateRequest(createSessionSchema), createSessionHandler)
authRoute.post('/refresh', refreshAccessTokenHandler)

export default authRoute
