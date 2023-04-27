import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard as AuthGuardInternal } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { META_UNPROTECTED } from './public.decorator'

@Injectable()
export class AuthGuard extends AuthGuardInternal() {
  public constructor(private readonly reflector: Reflector) {
    super(['jwt'])
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isUnprotected = this.reflector.getAllAndOverride<boolean>(META_UNPROTECTED, [context.getClass(), context.getHandler()])
    return isUnprotected || super.canActivate(context)
  }
}
