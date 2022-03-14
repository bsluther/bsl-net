import { Duration } from 'luxon'
import { DateTime } from 'luxon'
import { Pair, ifElse } from 'sanctuary'


// diff :: DateTime -> DateTime -> Duration
const diff = dt1 => dt2 => dt1.diff(dt2)

// diffNow :: DateTime -> Duration
const diffNow = dt => dt.diffNow()

// isValid :: DateTime -> Boolean
const isValid = dt => dt.isValid

// equals :: DateTime -> DateTime -> Boolean
const equals = dt1 => dt2 => dt1.equals(dt2)

// toObject :: DateTime -> Object
const toObject = dt => dt.toObject()

// isDuration :: Duration -> Boolean
const isDuration = dur => Duration.isDuration(dur)

// isDateTime :: a -> Boolean
const isDateTime = x => DateTime.isDateTime(x)

// luxonPlus :: Luxon -> Luxon -> Luxon
const luxonPlus = x1 => x2 => x1.plus(x2)

// luxonMinus :: Luxon -> Luxon -> Luxon
const luxonMinus = x1 => x2 => x1.minus(x2)

// toFormat :: String -> Luxon -> String
const toFormat = format => x => x.toFormat(format)


export {
  diff,
  equals,
  isDuration,
  isValid,
  luxonMinus,
  luxonPlus,
  toFormat,
  toObject,
  isDateTime
}