import { HttpStatus } from "@nestjs/common"

export class NotFound extends Error {
  protected statusCode: number = HttpStatus.NOT_FOUND
  public message: string = 'Not Found'

  public getStatus(): number {
    return this.statusCode
  }
}
