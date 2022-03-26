import { replace, reduce } from 'ramda'
import { v4 as uuid } from 'uuid'

const isTypeof = typeStr => x => typeof x === typeStr
const log = x => {
  console.log('LOG: ', x)
  return x
}

/*****  *****/

const makeId = prefix => `${prefix}-${uuid()}`
const blcId = () => makeId('blc')
const catId = () => makeId('cat')

/*****  *****/

const snakeToSpaced = replace(/_/g)(' ')

/*****  *****/

const assign = target => src => Object.assign({}, target, src)
const keyById = obj => ({ [obj._id]: obj })
const foldToIdObj = reduce((acc, x) => assign(acc)(keyById(x)))
                          ({})

/*****  *****/

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

/*****  *****/


export { snakeToSpaced, blcId, catId, foldToIdObj, isTypeof, log, scrollIntoViewIfNeeded }