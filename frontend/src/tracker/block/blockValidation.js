import { isArray, isPresent, isType, minLength, isISODate, isISOTime } from '../../Villa/Validation'

const validators = {
  _id: isType('string').concat(minLength(4)),
  category: isType('string').concat(minLength(4)),
  user: isType('string').concat(minLength(3)),
  startDate: isISODate,
  startTime: isISOTime,
  endDate: isISODate,
  endTime: isISOTime,
  start: isPresent,
  end: isPresent,
  notes: isType('string'),
  tags: isArray
}

export { validators }