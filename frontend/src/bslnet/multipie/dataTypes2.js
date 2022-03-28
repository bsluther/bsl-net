import { prop } from 'ramda'
import { sortBy } from 'ramda'
import { values, filter, map, add } from 'ramda'
import { pipe, reduce } from 'sanctuary'
import { dataGroups } from './sliceData'
import { calcCircleVector } from './Vector'

const percentageToTheta = percentage =>
  percentage * 2 * Math.PI

const CONFIG = {
  tierRadii: [0, 35, 50],
  startTheta: 0
}

const sumPrecedingThetas = index => pipe([
  filter(dtm => dtm.index < index),
  reduce(acc => x => 
          add(acc)(percentageToTheta(x.percentage))
        )
        (0)
])

// this should be able to make any slice if I specify the zero radius as zero
// as long as the math doesn't blow up
const makeInnerSlice = ({ config, dataGroups, datum, tier, parentPercentage = 1, parentStartingTheta = 0 }) => {
  console.log(parentStartingTheta)
  const index = datum.index
  const theta1 = index === 0 
    ? config.startTheta + parentStartingTheta
    : (sumPrecedingThetas(index)(dataGroups) * parentPercentage) + parentStartingTheta
  const theta2 = (theta1 + percentageToTheta(datum.percentage * parentPercentage))
  const innerRadius = config.tierRadii[tier]
  const outerRadius = config.tierRadii[tier + 1]

  return ({
    id: datum.id,
    innerRadius,
    outerRadius,
    tier,
    index,
    theta1,
    theta2,
    innerPoint1: calcCircleVector(theta1)(innerRadius),
    innerPoint2: calcCircleVector(theta2)(innerRadius),
    outerPoint1: calcCircleVector(theta1)(outerRadius),
    outerPoint2: calcCircleVector(theta2)(outerRadius)
  })
}

// console.log(makeInnerSlice({
//   config: CONFIG,
//   dataGroups,
//   id: 'math'
// }))

const sortByIndex = sortBy(prop('index'))
const sortedTier0 = sortByIndex(values(dataGroups))
const TIER0_PERCENTAGES = reduce(acc => dtm => ({
                                   ...acc,
                                   index: dtm.index,
                                   [dtm.id]: acc.total,
                                   total: add(acc.total)(dtm.percentage)                               
                                 }))
                                ({ total: 0 })
                                (sortedTier0)



const slices = map(dtm => makeInnerSlice({ 
                    config: CONFIG,
                    dataGroups,
                    id: dtm.id,
                    tier: 0,
                    datum: dtm
                  }))
                  (values(dataGroups))


const webdevSlices = map(dtm => makeInnerSlice({
                          config: CONFIG,
                          dataGroups: dataGroups.webdev.children,
                          tier: 1,
                          datum: dtm,
                          parentPercentage: dataGroups.webdev.percentage,
                          parentStartingTheta: percentageToTheta(TIER0_PERCENTAGES.webdev)
                        }))
                        (dataGroups.webdev.children)


const mathSlices = map(dtm => makeInnerSlice({
                          config: CONFIG,
                          dataGroups: dataGroups.math.children,
                          tier: 1,
                          datum: dtm,
                          parentPercentage: dataGroups.math.percentage,
                          parentStartingTheta: percentageToTheta(TIER0_PERCENTAGES.math)
                        }))
                        (dataGroups.math.children)


const theorySlices = map(dtm => makeInnerSlice({
                          config: CONFIG,
                          dataGroups: dataGroups.theory.children,
                          tier: 1,
                          datum: dtm,
                          parentPercentage: dataGroups.theory.percentage,
                          parentStartingTheta: percentageToTheta(TIER0_PERCENTAGES.theory)
                        }))
                        (dataGroups.theory.children)

export { makeInnerSlice, slices, webdevSlices, mathSlices, theorySlices }