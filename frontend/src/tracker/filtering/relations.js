// relation :: Comparator -> Data -> Boolean

const include = comparator => data =>
  comparator.includes(data)

// console.log(include(['web_development', 'tracker'])('tracker'))

const exclude = comparator => data => {
  return !comparator.includes(data)
}
// console.log(exclude(['web_development', 'tracker'])('tracker'))

const gte = comparator => data => {
  const res = data >= comparator
  // console.log('gte', comparator.ts, data.ts, res)
  return res
}
// console.log(gte(1)(2))

const lte = comparator => data => {
  const res = data <= comparator
  // console.log('lte comparator', comparator.toISO())
  // console.log('lte', comparator.ts, data.ts, res)
  return res
}
// console.log(lte(2)(1))

const relationHash = {
  include,
  exclude,
  gte,
  lte
}

export default relationHash