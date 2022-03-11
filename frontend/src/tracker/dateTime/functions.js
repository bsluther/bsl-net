import { DateTime } from 'luxon'
import { Just, Nothing, Pair, pair, bimap, compose as B } from 'sanctuary'
import { isDuration, isValid, luxonMinus, luxonPlus, toObject } from './pointfree'
import { ifElse } from 'ramda'
import { map } from 'ramda'
import { and } from 'ramda'
import { Duration } from 'luxon'

const aValidISOTime = '16:46:38.448'
const anInvalidISOTime = 'k16:46:38.448'

const aValidISODate = "2022-03-04"

/**************************** MISC *********************************/

// ago :: Duration ->  DateTime
const objAgo = obj => luxonMinus(DateTime.now())(Duration.fromObject(obj))

// joinISOs :: ISODate -> ISOTime -> ISO
const joinISOs = isoDate => isoTime => 
  `${isoDate}T${isoTime}`

// inRange :: DateTime -> DateTime -> DateTime -> Boolean
const inRange = lowerDT => upperDT => dt =>
  lowerDT < dt && dt < upperDT

// gt :: DateTime -> DateTime -> Boolean
const gt = lowerDT => dt =>
  lowerDT < dt

const isoDateNow = () => DateTime.now().toISODate()

const nowSansSeconds = () =>
  DateTime.now().set({ second: 0, millisecond: 0}).toISOTime({ suppressMilliseconds: true, suppressSeconds: true, includeOffset: false })

// CONSIDER DELETING
// safeAddDurs :: Duration -> Duration -> Maybe Duration
const safeAddDurs = dur1 => dur2 =>
  ifElse(B(pair(and))
          (bimap(isDuration)
                (isDuration)))
        (pair(luxonPlus))
        (Nothing)
        (Pair(dur1)(dur2))

// emptyDuration :: () -> Duration
const emptyDuration = () => Duration.fromMillis(0)


// emptyDT :: () -> DateTime
const emptyDT = () => DateTime.fromMillis(0)


/**************************** PARSING *********************************/

// fromISO :: ISO -> Maybe DateTime
const fromISO = iso => 
  ifElse(isValid)
        (Just)
        (() => Nothing)
        (DateTime.fromISO(iso))


// const maybeTime = fromISO(aValidISOTime)
// const maybeDate = fromISO(aValidISODate)


// console.log(
//   map(toObject)(maybeTime),
//   map(toObject)(maybeDate),
// )




export {
  emptyDuration,
  fromISO,
  gt,
  inRange,
  joinISOs,
  objAgo,
  safeAddDurs,
  nowSansSeconds,
  emptyDT,
  isoDateNow
}