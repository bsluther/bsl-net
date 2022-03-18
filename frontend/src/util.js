import { replace } from 'ramda'
import { v4 as uuid } from 'uuid'

const makeId = prefix => `${prefix}-${uuid()}`
const blcId = () => makeId('blc')
const catId = () => makeId('cat')

const snakeToSpaced = replace(/_/g)(' ')


// IMPROVE:
// make a version that works on mobile
const scrollIntoViewIfNeeded = el => {
  const trackerBody = document.getElementById('tracker-body')
  const bodyRect = trackerBody.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  if (elRect.bottom > bodyRect.bottom) {
    el.scrollIntoView(false)
  }

  if (elRect.top < bodyRect.top) {
    el.scrollIntoView(false)
  }
}



export { snakeToSpaced, blcId, catId, scrollIntoViewIfNeeded }