import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    firstname: string({
      required_error: 'firstname is required'
    }),
    lastname: string({
      required_error: 'lastname is required'
    }),
    email: string({
      required_error: 'email is required'
    }).email('Email is not valid'),
    password: string({
      required_error: 'Password is required'
    }).min(6, 'Password is too short, minimum length is 6'),
    passwordConfirmation: string({
      required_error: 'Password Confirmation is required'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password do not match',
    path: ['passwordConfirmation']
  })
})

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string()
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Email is not valid')
  })
})

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string()
  }),
  body: object({
    password: string({
      required_error: 'Password is required'
    }).min(6, 'Password is too short, minimum length is 6'),
    passwordConfirmation: string({
      required_error: 'Password Confirmation is required'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password do not match',
    path: ['passwordConfirmation']
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params']
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body']
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>
