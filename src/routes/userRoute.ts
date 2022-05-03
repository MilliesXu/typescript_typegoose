import express from 'express'

import { createUserHandler, verifyUserHandler, forgotPasswordHandler, resetPasswordHandler, getUserHandler } from '../controllers/userController'
import validateRequest from '../middlewares/validateResource'
import deserializerUser from '../middlewares/deserializerUser'
import { createUserSchema, verifyUserSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/userSchema'

const userRoute = express.Router()

userRoute.post('/', validateRequest(createUserSchema), createUserHandler)
userRoute.post('/verify/:id/:verificationCode', validateRequest(verifyUserSchema), verifyUserHandler)
userRoute.post('/forgotpassword', validateRequest(forgotPasswordSchema), forgotPasswordHandler)
userRoute.post('/resetpassword/:id/:passwordResetCode', validateRequest(resetPasswordSchema), resetPasswordHandler)
userRoute.get('/', deserializerUser, getUserHandler)

export default userRoute
