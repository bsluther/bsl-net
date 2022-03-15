import { isValidDate, isValidTime } from 'iso-datestring-validator'
import { keys } from 'ramda'
import { foldMap, maybe, get } from 'sanctuary'
import { isTypeof } from '../tracker/functions'



const FL = {
  concat: 'fantasy-land/concat',
  empty: 'fantasy-land/empty'
}

const Success = x =>
({
  isFail: false,
  x,
  fork: (f, g) => g(x),
  concat: other =>
    other.isFail ? other : Success(x),
  [FL.concat]: other =>
    other.isFail ? other : Success(x),
  [FL.empty]: () => Success([])
})
Success[FL.empty] = () => Success([])

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

// const identityV = Validation((key))

const isPresent = Validation((key, x) =>
  !!x
    ? Success(x)
    : Fail([`${key} must be present`]))

const isISODate = Validation((key, x) =>
  isValidDate(x)
    ? Success(x)
    : Fail([`${key} is not a valid date`])
)

const isArray = Validation((key, x) =>
  Array.isArray(x)
    ? Success(x)
    : Fail([`${key} is not an array`]))

const isType = str => Validation((key, x) =>
  isTypeof(str)(x)
    ? Success(x)
    : Fail([`${key} is not a member of type "${str}"`])
)

// you want side-by-side and nested validations, eventually.
// really the maybe check is deciding if it's a String, or could be decided by that
const minLength = num => Validation((key, x) =>
  maybe(Fail([`${key} must have a length`]))
       (len => len >= num
          ? Success(x)
          : Fail([`${key} must be at least ${num} characters long`]))
       (get(isTypeof('number'))
           ('length')
           (x))
)

const isValidISOTime = str => isValidTime(str, undefined, true)
const isISOTime = Validation((key, x) =>
  isValidISOTime(x)
    ? Success(x)
    : Fail([`${key} is not a valid time`])
)

const validate = validators => obj =>
  foldMap(Success)
         (key => validators[key].run(key, obj[key]))
         (keys(obj))

// const validate_ = (validators, obj) =>
//   List(Object.keys(validators)).foldMap(key =>
//     validators[key].run(key, obj[key])
//     , Success([obj]))

export { 
  Validation,
  validate,
  isPresent,
  isArray,
  isType,
  isISODate,
  isISOTime,
  minLength,
}