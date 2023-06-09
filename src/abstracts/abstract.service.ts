import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Request } from 'express'

export interface AbstractServiceContext {
  [key: string | number]: any

  moduleRef?: ModuleRef
  request?: Request & { user: any }
}

@Injectable()
export abstract class AbstractService {
  protected logger: Logger
  protected moduleRef?: ModuleRef
  protected request?: Request & { user?: any }

  public constructor(context?: AbstractServiceContext) {
    this.moduleRef = context?.moduleRef
    this.request = context?.request
    this.logger = new Logger(this.serviceName)
  }

  public get serviceName(): string {
    return (<any>this).constructor.name.replace(/Service$/, '')
  }
}
