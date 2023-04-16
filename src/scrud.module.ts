// import { DynamicModule, Module } from '@nestjs/common'
// import { ScrudCoreModule } from './scrud.core-module'
// import { ScrudModuleAsyncOptions, ScrudModuleOptions } from './scrud.interfaces'

// @Module({})
// export class ScrudModule {
//   public static forRoot(options: ScrudModuleOptions, connection?: string): DynamicModule {
//     return {
//       module: ScrudModule,
//       imports: [ScrudCoreModule.forRoot(options, connection)],
//       exports: [ScrudCoreModule],
//     }
//   }

//   public static forRootAsync(options: ScrudModuleAsyncOptions, connection?: string): DynamicModule {
//     return {
//       module: ScrudModule,
//       imports: [ScrudCoreModule.forRootAsync(options, connection)],
//       exports: [ScrudCoreModule],
//     }
//   }
// }
