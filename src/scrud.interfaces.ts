export interface ScrudModuleOptions {
  disableHttpExceptionFilter?: boolean
}

export interface ScrudModuleOptionsFactory {
  createScrudModuleOptions(): Promise<ScrudModuleOptions> | ScrudModuleOptions
}
