import { Types, Document } from 'mongoose'

export abstract class AbstractSchema extends Document {
  public readonly _id: Types.ObjectId | any
}
