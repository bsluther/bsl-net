import { replace } from 'ramda'
import { v4 as uuid } from 'uuid'

const makeId = prefix => `${prefix}-${uuid()}`
const blcId = () => makeId('blc')
const catId = () => makeId('cat')

const snakeToSpaced = replace(/_/g)(' ')

export { snakeToSpaced, blcId, catId }