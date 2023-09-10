import { ExecutionContext, Logger, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const DEFAULT_SEARCH_OPTIONS = {
  loggerType: 'FilterOptionsControl',
  defaultLimit: 10,
  limitKey: 'limit',
  skipKey: 'skip',
  pageKey: 'page',
  sortKey: 'sort',
}

export interface FilterSearchOptions {
  loggerType?: string
  defaultLimit?: number
  limitKey?: string
  skipKey?: string
  pageKey?: string
  sortKey?: string
}

export interface SortOptions {
  [key: string]: 'asc' | 'desc' | 1 | -1
}

export interface FilterOptions {
  limit: number
  skip: number
  sort: SortOptions
}

/* istanbul ignore next */
// noinspection JSUnusedGlobalSymbols
export const SearchFilterOptions = createParamDecorator((options: FilterSearchOptions, ctx: ExecutionContext): FilterOptions => {
  options = { ...DEFAULT_SEARCH_OPTIONS, ...options }
  const req = ctx.switchToHttp().getRequest<Request>()
  const limit = parseInt(req.query[options.limitKey], 10) || options.defaultLimit
  let skip = parseInt(req.query[options.skipKey], 10) || 0
  if (req.query[options.pageKey]) {
    if (skip > 0) Logger.debug(`Both ${options.skipKey} and ${options.pageKey} are set. ${options.skipKey} will be ignored`, options.loggerType)
    skip = (parseInt(req.query[options.pageKey], 10) - 1) * limit
  }
  const sort = {}
  for (const key in req.query[options.sortKey]) {
    switch (`${req.query[options.sortKey][key]}`.toLowerCase()) {
      case '1':
      case 'asc':
        sort[key] = 1
        break

      case '-1':
      case 'desc':
        sort[key] = -1
        break
    }
  }
  return {
    limit,
    skip,
    sort,
  }
})
