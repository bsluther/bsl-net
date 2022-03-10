import { isValidDate, isValidTime } from 'iso-datestring-validator'
import { DateTime } from 'luxon'

// const aTime = DateTime
//               .now()
//               // .set({ second: 0, millisecond: 0 })
//               .toISOTime({ suppressMilliseconds: true, suppressSeconds: true })

// console.log(
//   aTime,
//   isValidTime(aTime, undefined, true)
// )



const FL = {
  concat: 'fantasy-land/concat'
}

const Success = x =>
({
  isFail: false,
  x,
  fork: (f, g) => g(x),
  concat: other =>
    other.isFail ? other : Success(x),
  [FL.concat]: other =>
    other.isFail ? other : Success(x)
})

const Fail = x =>
({
  isFail: true,
  x,
  fork: (f, g) => f(x),
  concat: other =>
    other.isFail ? Fail(x.concat(other.x)) : Fail(x),
  [FL.concat]: other =>
    other.isFail ? Fail(x.concat(other.x)) : Fail(x)
})

const Validation = run =>
({
  run,
  concat: other =>
    Validation((key, x) => run(key, x).concat(other.run(key, x))),
  [FL.concat]: other =>
    Validation((key, x) => run(key, x).concat(other.run(key, x))),
})

const isPresent = Validation((key, x) =>
  !!x
    ? Success(x)
    : Fail([`${key} must be present`]))

const isISODate = Validation((key, x) =>
  isValidDate(x)
    ? Success(x)
    : Fail([`${key} is not a valid date`])
)

const isValidISOTime = str => isValidTime(str, undefined, true)

const isISOTime = Validation((key, x) =>
  isValidISOTime(x)
    ? Success(x)
    : Fail([`${key} is not a valid time`])
)

export { Validation }