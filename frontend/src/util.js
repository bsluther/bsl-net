import { replace } from 'ramda'

const snakeToSpaced = replace(/_/g)(' ')

export { snakeToSpaced}