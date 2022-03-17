import { replace } from 'ramda'
import { v4 as uuid } from 'uuid'

const makeId = prefix => `${prefix}-${uuid()}`
const blcId = () => makeId('blc')
const catId = () => makeId('cat')

const snakeToSpaced = replace(/_/g)(' ')

const fnUpdate = setter => arg => {
  if (typeof arg === 'function') {
    return setter(prev => arg(prev))
  }
  if (typeof arg !== 'function') {
    return setter(arg)
  }
}

export { snakeToSpaced, blcId, catId, fnUpdate }