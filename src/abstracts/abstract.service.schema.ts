import { NotAcceptableException, NotFoundException } from '@nestjs/common'
import { Document, FilterQuery, Model, ModifyResult, ProjectionType, Query, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { ServiceSchemaInterface } from '../interfaces/service.schema.interface'
import { AbstractSchema } from './abstract.schema'
import { AbstractService, AbstractServiceContext } from './abstract.service'

export abstract class AbstractServiceSchema extends AbstractService implements ServiceSchemaInterface {
  protected abstract _model: Model<AbstractSchema | any>

  public constructor(context?: AbstractServiceContext) {
    super(context)
  }

  public get model(): Model<AbstractSchema> {
    return this._model
  }

  public async find<T extends AbstractSchema>(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<Query<Array<T>, T, any, T>[]> {
    this.logger.debug(['find', JSON.stringify(Object.values(arguments))].join(' '))
    return await this._model.find<Query<Array<T>, T, any, T>>(filter, projection, options).exec()
  }

  public async count<T extends AbstractSchema>(filter?: FilterQuery<T>, options?: QueryOptions<T>): Promise<number> {
    this.logger.debug(['count', JSON.stringify(Object.values(arguments))].join(' '))
    return await this._model.countDocuments(filter, options).exec()
  }

  public async findAndCount<T extends AbstractSchema>(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<[Query<Array<T>, T, any, T>[], number]> {
    this.logger.debug(['findAndCount', JSON.stringify(Object.values(arguments))].join(' '))
    const count = await this._model.countDocuments(filter, options).exec()
    if (!count) return [[], 0]
    return [await this._model.find<Query<Array<T>, T, any, T>>(filter, projection, options).exec(), count]
  }

  public async findById<T extends AbstractSchema>(
    _id: Types.ObjectId | any,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<Query<any, any, any, any>> {
    //TODO fix this
    this.logger.debug(['findById', JSON.stringify(Object.values(arguments))].join(' '))
    if (!Types.ObjectId.isValid(_id)) throw new NotAcceptableException('Invalid ObjectId')
    const data = await this._model.findById<Query<T | null, T, any, T>>(_id, projection, options).exec()
    if (!data) throw new NotFoundException('Not found')
    return data
  }

  public async findOne<T extends AbstractSchema>(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<Query<T, T, any, T>> {
    this.logger.debug(['findOne', JSON.stringify(Object.values(arguments))].join(' '))
    const data = await this._model.findOne<Query<T | null, T, any, T>>(filter, projection, options).exec()
    if (!data) throw new NotFoundException('Not found')
    return data
  }

  public async create<T extends AbstractSchema>(data?: any, options?: SaveOptions): Promise<Document<T, any, T>> {
    this.logger.debug(['create', JSON.stringify(Object.values(arguments))].join(' '))
    const document: Document<T, any, T> = new this._model(data)
    return document.save(options)
  }

  public async update<T extends AbstractSchema>(
    _id: Types.ObjectId | any,
    update: UpdateQuery<T>,
    options?: QueryOptions<T> & { rawResult: true },
  ): Promise<ModifyResult<Query<T, T, any, T>>> {
    this.logger.debug(['update', JSON.stringify(Object.values(arguments))].join(' '))
    const document = await this._model
      .findByIdAndUpdate<Query<T | null, T, any, T>>({ _id }, update, {
        new: true,
        runValidators: true,
        ...options,
      })
      .exec()
    if (!document) throw new NotFoundException('Not found')
    return document
  }

  public async delete<T extends AbstractSchema>(
    _id: Types.ObjectId | any,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<Query<T, T, any, T>> {
    this.logger.debug(['delete', JSON.stringify(Object.values(arguments))].join(' '))
    const document = await this._model.findByIdAndDelete<Query<T | null, T, any, T>>({ _id }, options).exec()
    if (!document) throw new NotFoundException('Not found')
    return document
  }
}
