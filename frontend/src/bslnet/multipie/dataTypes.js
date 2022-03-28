import { map, addIndex, reduce } from 'ramda'
const mapIx = addIndex(map)
const reduceIx = addIndex(reduce)

const Vector = x => y => ({ x, y })
const vectorAdd = v1 => v2 => Vector(v1.x + v2.x)(v1.y + v2.y)

const xComponent = radians => radius =>
  Math.cos(radians) * radius

const yComponent = radians => radius =>
  Math.sin(radians) * radius

const calcCircleVector = radians => radius =>
  Vector(xComponent(radians)(radius))
        (yComponent(radians)(radius))

const calcTheta2 = percentage => startTheta =>
  (percentage * 2 * Math.PI) + startTheta

const calcOuterTheta2 = percentage => startTheta => parentTheta =>
  (percentage * parentTheta) + startTheta

const diffTheta = theta1 => theta2 =>
  Math.abs(theta1 - theta2)

const makeInnerSlice = radius => tier => index => startTheta => datum => {
  const theta2 = calcTheta2(datum.percentage)(startTheta)

  return ({
    datumId: datum.id,
    radius,
    tier,
    index,
    theta1: startTheta,
    theta2,
    point1: calcCircleVector(startTheta)(radius),
    point2: calcCircleVector(theta2)(radius)
  })
}

const makeOuterSlice = radius => tier => index => startTheta => datum => parentSlice => {
  const theta2 = calcOuterTheta2(datum.percentage)
                                (startTheta)
                                (diffTheta(parentSlice.theta1)(parentSlice.theta2))

  return ({
    datumId: datum.id,
    radius,
    tier,
    index,
    theta1: startTheta,
    theta2,
    outerPoint1: calcCircleVector(startTheta)(radius),
    innerPoint1: calcCircleVector(startTheta)(parentSlice.radius),
    outerPoint2: calcCircleVector(theta2)(radius),
    innerPoint2: calcCircleVector(theta2)(parentSlice.radius),
    parentSlice
  })
}

const Datum = id => percentage => ({
  id,
  percentage
})

const TIER1RADIUS = 30
const TIER2RADIUS = 45
const START_THETA = 0

const datum1 = Datum('webdev')(0.7)
const datum2 = Datum('math')(0.1)
const datum3 = Datum('theory')(0.2)
const tier1data = [datum1, datum2, datum3]

const datum1_1 = Datum('tracker')(0.7)
const datum1_2 = Datum('svg')(0.3)

const datum2_1 = Datum('linear_algebra')(0.4)
const datum2_2 = Datum('set_theory')(0.6)

const datum3_1 = Datum('fp')(0.8)
const datum3_2 = Datum('type_theory')(0.2)

const slice1 = makeInnerSlice(TIER1RADIUS)
                             (1)
                             (0)
                             (START_THETA)
                             (datum1)
const slice2 = makeInnerSlice(TIER1RADIUS)
                             (1)
                             (1)
                             (slice1.theta2)
                             (datum2)
const slice3 = makeInnerSlice(TIER1RADIUS)
                             (1)
                             (2)
                             (slice2.theta2)
                             (datum3)

const slice1_1 = makeOuterSlice(TIER2RADIUS)
                               (2)
                               (0)
                               (slice1.theta1)
                               (datum1_1)
                               (slice1)

const slice1_2 = makeOuterSlice(TIER2RADIUS)
                               (2)
                               (1)
                               (slice1_1.theta2)
                               (datum1_2)
                               (slice1)

const slice2_1 = makeOuterSlice(TIER2RADIUS)
                               (2)
                               (0)
                               (slice2.theta1)
                               (datum2_1)
                               (slice2)

const slice3_1 = makeOuterSlice(TIER2RADIUS)
                               (2)
                               (0)
                               (slice3.theta1)
                               (datum3_1)
                               (slice3)

const slice3_2 = makeOuterSlice(TIER2RADIUS)
                               (2)
                               (0)
                               (slice3_1.theta2)
                               (datum3_2)
                               (slice3)

export { Vector, vectorAdd, slice1, slice2, slice3, slice1_1, slice1_2, slice2_1, slice3_1, slice3_2, diffTheta, calcCircleVector }