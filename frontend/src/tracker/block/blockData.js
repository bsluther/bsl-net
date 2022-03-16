import { blcId } from '../functions'
import { DateTime } from 'luxon'
import { Pair, lift2, pair, maybe, pipe, justs, reduce as fold } from 'sanctuary'
import { ifElse, map, filter } from 'ramda'
import { fromISO, joinISOs, gt, inRange, emptyDuration, emptyDT } from '../dateTime/functions'
import { Nothing, compose as B, I } from 'sanctuary'
import { diff, isDuration, luxonPlus } from '../dateTime/pointfree'

// const aBlock = {
//   "_id": "blc-dd33bd55-2770-493b-9491-f994c5b3f18d",
//   "user": "bsluther",
//   "category": "cat-58b0c193-4683-4f34-b7d8-ed92843cdbf9",
//   "start": {
//       "date": "2022-03-04",
//       "time": "15:57:03.113"
//   },
//   "end": {
//       "date": "2022-03-04",
//       "time": "21:27:03.113"
//   },
//   "categoryName": "hacker_rank"
// }

// const someTags = ['mobile', 'presentation', 'block editor', 'design', 'test', 'test']

const blockConstructor = user => ({
  _id: blcId(),
  user,
  category: undefined,
  start: {
    date: DateTime.now().toISODate(),
    time: DateTime.now().minus({ hour: 1, minute: 30 }).set({ milliseconds: 0, seconds: 0 }).toISOTime({ suppressMilliseconds: true, suppressSeconds: true, includeOffset: false })
  },
  end: {
    date: DateTime.now().toISODate(),
    time: DateTime.now().set({ milliseconds: 0, seconds: 0 }).toISOTime({ suppressMilliseconds: true, suppressSeconds: true, includeOffset: false })
  },
  notes: '',
  tags: []
})

const Block = {
  constructor: blockConstructor,
  id: ['_id'],
  user: ['user'],
  category: ['category'],
  categoryName: ['categoryName'],
  startDate: ['start', 'date'],
  startTime: ['start', 'time'],
  endDate: ['end', 'date'],
  endTime: ['end', 'time'],
  notes: ['notes'],
  tags: ['tags']
}

// blockDT :: String -> Block -> Maybe DateTime
const blockDT = prop => blc => 
  ifElse(pair(a => b => !!a && !!b))
        (B(fromISO)
          (pair(joinISOs)))
        (() => Nothing)
        (Pair(blc[prop].date)(blc[prop].time))

// blockStart :: Block -> Maybe DateTime
const blockStart = blockDT('start')

// blockEnd :: Block -> Maybe DateTime
const blockEnd = blockDT('end')

// maybeStart :: Block -> DateTime
const maybeStart = blc => maybe(emptyDT())(I)(blockStart(blc))

// maybeEnd :: Block -> DateTime
const maybeEnd = blc => maybe(emptyDT())(I)(blockEnd(blc))

// blockDuration :: Block -> Maybe Duration
const blockDuration = blc =>
  lift2(diff)
       (blockEnd(blc))
       (blockStart(blc))

const blockStartedAfter = dt => blc =>
  maybe(false)(gt(dt))(blockStart(blc))


const blockInRange = dt1 => dt2 => blc =>
  maybe(false)(inRange(dt1)(dt2))(blockStart(blc))

// sumBlocks :: [Block] -> Duration
const sumBlocks = pipe([
  map(blockDuration),
  justs,
  filter(isDuration),
  fold(luxonPlus)(emptyDuration())
])

export { 
  Block,
  blockDT,
  blockInRange,
  blockStart,
  blockStartedAfter,
  blockEnd,
  blockDuration,
  sumBlocks,
  maybeStart,
  maybeEnd
}