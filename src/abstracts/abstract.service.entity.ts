import { AbstractService, AbstractServiceContext } from './abstract.service'

export abstract class AbstractServiceEntity extends AbstractService {
  public constructor(context?: AbstractServiceContext) {
    super(context)
  }
}
