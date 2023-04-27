import { BadRequestException, HttpStatus, ValidationPipe, ValidationError } from '@nestjs/common'

export class DtoValidationPipe extends ValidationPipe {
  public constructor() {
    super({
      transform: true,
      exceptionFactory: (errors) => {
        const validations = {}
        errors.forEach((error: ValidationError) => {
          if (error.constraints) {
            Object.values(error.constraints).forEach((value) => {
              validations[error.property] = value
            })
          }
          if (error.children.length > 0) {
            validations[error.property] = {}
            error.children.forEach((childError: ValidationError) => {
              if (childError.constraints) {
                Object.values(childError.constraints).forEach((value) => {
                  validations[error.property][childError.property] = value
                })
              }
            })
          }
        })
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Validation failed: ${errors.map((error) => error.property).join(', ')}`,
          validations,
        })
      },
    })
  }
}
