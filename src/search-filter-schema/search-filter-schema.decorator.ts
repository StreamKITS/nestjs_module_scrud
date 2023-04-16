import { ExecutionContext, Logger, createParamDecorator } from '@nestjs/common'
import merge from 'deepmerge'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import dayjs from 'dayjs'

export const DEFAULT_ALLOWED_FILTERS = ['=', '?', '#', '!', '>', '<', '^', '@']
export const DEFAULT_SCHEMA_OPTIONS = {
  loggerType: 'FilterSchemaControl',
  unsafe: false,
}

export interface FilterSchemaOptions {
  loggerType?: string
  dayjsLocale?: string
  unsafe?: boolean
}

/* istanbul ignore next */
export const SearchFilterSchema = createParamDecorator((options: object, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>()
  return filterSchema(req.query.filters, options) //TODO option change query filter name
})

export function filterSchema(filters: string | string[] | ParsedQs | ParsedQs[], options?: FilterSchemaOptions) {
  options = { ...DEFAULT_SCHEMA_OPTIONS, ...options }
  if (typeof filters === 'object') {
    let conditions = {}
    for (const key of Object.keys(filters)) {
      const data = filters[key]
      switch (key) {
        case '$and':
          console.log('$and')
          internalFilterbyType(key, data)
          break

        case '$or':
          console.log('$or')
          internalFilterbyType(key, data, DEFAULT_ALLOWED_FILTERS, options)
          break

        default:
          conditions = merge(conditions, internalFilterbyType(key, data, DEFAULT_ALLOWED_FILTERS, options))
          break
      }
    }
    return conditions
  }
}

function internalFilterbyType(
  key: string,
  data: string,
  allowed: string[] = DEFAULT_ALLOWED_FILTERS,
  options: FilterSchemaOptions = DEFAULT_SCHEMA_OPTIONS,
) {
  const parsed = {}
  const keyCheck = key.replace(new RegExp(`[${allowed.join('')}]`, 'g'), '')
  if (keyCheck.length === 0 || !allowed.includes(key[0]) && !/[a-zA-Z0-9-_]/.test(key[0])) return {}
  switch (key[0]) {
    case '?': {
      parsed[key.slice(1)] = /true|on|yes|1/i.test(data)
      break
    }

    case '#': {
      const valueHashtag = Number(data)
      if (isNaN(valueHashtag)) {
        Logger.verbose(`Invalid filter key ${key.slice(1)} with number: ${data}`, options.loggerType)
        break
      }
      parsed[key.slice(1)] = valueHashtag
      break
    }

    case '!': {
      const valueExclamation = internalFilterbyType(key.slice(1), data, ['#', '@'])
      if (Object.keys(valueExclamation).length === 0) break
      const typeExclamation = Object.keys(valueExclamation[keyCheck])[0]
      if (typeExclamation === '$in') {
        parsed[keyCheck] = { $nin: valueExclamation[keyCheck]['$in'] }
        break
      }
      parsed[keyCheck] = { $ne: valueExclamation[keyCheck] }
      break
    }

    case '<':
    case '>': {
      let upperLowerType = key[0] === '>' ? '$gt' : '$lt'
      if (key[1] === '=') upperLowerType = `${upperLowerType}e`
      const upperLowerKey = key.slice(upperLowerType.length - 2)
      const valueGreater = internalFiltersByTypeUpperLower(upperLowerType, upperLowerKey, data, options)
      if (Object.keys(valueGreater).length === 0) break
      const subKeyGreater = Object.keys(valueGreater)[0]
      // parsed[subKeyGreater] = { ...parsed[subKeyGreater], ...valueGreater[subKeyGreater] }
      parsed[subKeyGreater] = valueGreater[subKeyGreater]
      break
    }

    case '^': {
      const re = data.trim().split('/')
      if (re[0] !== '' || re.length < 3) {
        Logger.verbose(`Invalid filter key ${keyCheck} with regex: ${data}`, options.loggerType)
        break
      }
      re.shift()
      const $options = re.pop()
      parsed[key.slice(1)] = { $regex: re.join('') }
      if ($options) parsed[key.slice(1)]['$options'] = $options
      break
    }

    case '@': {
      let subKeyAt
      const $in = []
      if (!Array.isArray(data)) {
        Logger.verbose(`Invalid filter key ${keyCheck} with bad array: ${data}`, options.loggerType)
        break
      }
      for (const d of data) {
        const valueAt = internalFilterbyType(key.slice(1), d, ['#'])
        if (Object.keys(valueAt).length === 0) break
        subKeyAt = Object.keys(valueAt)[0]
        $in.push(valueAt[subKeyAt])
      }
      if (!subKeyAt) {
        Logger.verbose(`Invalid filter key ${keyCheck} with array: ${JSON.stringify(data)}`, options.loggerType)
        break
      }
      parsed[subKeyAt] = { $in }
      break
    }

    case '=': {
      if (Array.isArray(data)) {
        Logger.verbose(`Invalid filter key ${keyCheck} with strict string: ${JSON.stringify(data)}`, options.loggerType)
        break
      }
      parsed[key.slice(1)] = `${data}`
      break
    }

    default: {
      if (!options.unsafe && Array.isArray(data)) {
        Logger.verbose(`Invalid filter key ${keyCheck} with unsafe: ${JSON.stringify(data)}`, options.loggerType)
        break
      }
      parsed[key] = data
      break
    }
  }
  return parsed
}

function internalFiltersByTypeUpperLower(type: string, key: string, data: string, options?: FilterSchemaOptions): { [key: string]: { [key: string]: any } } {
  const parsed = {}
  if (key[0] !== '#') {
    parsed[key] = {}
    parsed[key][type] = dayjs(data, options.dayjsLocale).toDate()
    return parsed
  }
  const value = internalFilterbyType(key, data, ['#'])
  if (Object.keys(value).length === 0) return {}
  const subKey = Object.keys(value)[0]
  parsed[subKey] = {}
  parsed[subKey][type] = {}
  parsed[subKey][type] = value[subKey]
  return parsed
}
