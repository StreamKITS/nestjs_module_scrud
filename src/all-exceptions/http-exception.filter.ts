import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    Logger.debug(exception.stack, 'HttpExceptionFilter')
    return response.status(status).json(HttpException.createBody(exception.getResponse(), undefined, status))
  }
}
