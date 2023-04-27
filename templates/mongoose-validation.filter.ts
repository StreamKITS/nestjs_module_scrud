import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { Error } from 'mongoose'

@Catch(Error.ValidationError, Error.CastError)
export class MongooseValidationFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError | Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    Logger.debug(exception.message, 'MongooseValidationFilter')
    response.status(HttpStatus.BAD_REQUEST).json(
      HttpException.createBody(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: exception.message,
          validations: this.getValidationErrors(exception),
        },
        exception.constructor.name,
        HttpStatus.BAD_REQUEST,
      ),
    )
  }

  protected getValidationErrors(err: Error.ValidationError | Error.CastError): Record<string, any> {
    const validations = {}
    if (err instanceof Error.ValidationError) {
      for (const key in err.errors) {
        validations[key] = err.errors[key].message
      }
    } else if (err instanceof Error.CastError) {
      validations[err.path] = err.message
    }
    return validations
  }
}
