import { DynamicModule, Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './all-exceptions'
import { ScrudModuleOptions } from './scrud.interfaces'
import { NotFoundExceptionFilter } from './all-exceptions/notfound-exception.filter'

@Module({})
export class ScrudModule {
  public static forRoot(options: ScrudModuleOptions, connection?: string): DynamicModule {
    const providers = []
    if (options.disableHttpExceptionFilter !== true) {
      providers.push({
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      })
      providers.push({
        provide: APP_FILTER,
        useClass: NotFoundExceptionFilter,
      })
    }
    return {
      module: this,
      providers,
    }
  }
}
