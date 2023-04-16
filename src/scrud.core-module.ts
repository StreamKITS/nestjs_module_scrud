// import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
// import { ScrudModuleAsyncOptions, ScrudModuleOptions, ScrudModuleOptionsFactory } from './scrud.interfaces'
// import { createScrudConnection, getScrudConnectionToken, getScrudOptionsToken } from './scrud.utils'

// @Global()
// @Module({})
// export class ScrudCoreModule {
//   public static forRoot(options: ScrudModuleOptions, connection?: string): DynamicModule {
//     const ScrudOptionsProvider: Provider = {
//       provide: getScrudOptionsToken(connection),
//       useValue: options,
//     }

//     const ScrudConnectionProvider: Provider = {
//       provide: getScrudConnectionToken(connection),
//       useValue: createScrudConnection(options),
//     }

//     return {
//       module: ScrudCoreModule,
//       providers: [ScrudOptionsProvider, ScrudConnectionProvider],
//       exports: [ScrudOptionsProvider, ScrudConnectionProvider],
//     }
//   }

//   public static forRootAsync(options: ScrudModuleAsyncOptions, connection: string): DynamicModule {
//     const ScrudConnectionProvider: Provider = {
//       provide: getScrudConnectionToken(connection),
//       useFactory(options: ScrudModuleOptions) {
//         return createScrudConnection(options)
//       },
//       inject: [getScrudOptionsToken(connection)],
//     }

//     return {
//       module: ScrudCoreModule,
//       imports: options.imports,
//       providers: [...this.createAsyncProviders(options, connection), ScrudConnectionProvider],
//       exports: [ScrudConnectionProvider],
//     }
//   }

//   public static createAsyncProviders(options: ScrudModuleAsyncOptions, connection?: string): Provider[] {
//     if (!(options.useExisting || options.useFactory || options.useClass)) {
//       throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
//     }

//     if (options.useExisting || options.useFactory) {
//       return [this.createAsyncOptionsProvider(options, connection)]
//     }

//     return [this.createAsyncOptionsProvider(options, connection), { provide: options.useClass, useClass: options.useClass }]
//   }

//   public static createAsyncOptionsProvider(options: ScrudModuleAsyncOptions, connection?: string): Provider {
//     if (!(options.useExisting || options.useFactory || options.useClass)) {
//       throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
//     }

//     if (options.useFactory) {
//       return {
//         provide: getScrudOptionsToken(connection),
//         useFactory: options.useFactory,
//         inject: options.inject || [],
//       }
//     }

//     return {
//       provide: getScrudOptionsToken(connection),
//       async useFactory(optionsFactory: ScrudModuleOptionsFactory): Promise<ScrudModuleOptions> {
//         return await optionsFactory.createScrudModuleOptions()
//       },
//       inject: [options.useClass || options.useExisting],
//     }
//   }
// }
