import { getModelForClass, modelOptions, prop, Severity, pre, DocumentType } from '@typegoose/typegoose'
import argon2 from 'argon2'
import { nanoid } from 'nanoid'
import { log } from '../utils/logger'

// eslint-disable-next-line no-use-before-define
@pre<User>('save', async function () {
  if (!this.isModified('password')) return

  const hash = await argon2.hash(this.password)

  this.password = hash
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @prop({ lowercase: true, required: true, unique: true, type: String })
    email: string

  @prop({ required: true, type: String })
    firstname: string

  @prop({ required: true, type: String })
    lastname: string

  @prop({ required: true, type: String })
    password: string

  @prop({ required: true, type: String, default: () => nanoid() })
    verificationCode: string

  @prop({ type: String || null })
    passwordResetCode: string | null

  @prop({ default: false, type: String })
    verified: boolean

  async validationPassword (this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword)
    } catch (error) {
      log.error(error, 'Could not validate password')
      return false
    }
  }
}

export const userPrivateFields = [
  'password', 'verificationCode', 'passwordResetCode', '__v'
]

const UserModel = getModelForClass(User)

export default UserModel
