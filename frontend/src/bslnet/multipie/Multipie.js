import { Vector, vectorAdd, slice1, slice2, slice3, slice1_1, slice1_2, diffTheta, calcCircleVector, slice2_1, slice3_1, slice3_2 } from './dataTypes'
import { M, L, A, calcArcFlag, outerA } from './svgFunctions'
import { makeInnerSlice } from './dataTypes2'

const ORIGIN_VECTOR = Vector(50)(50)

const Point = ({ vector, originVector = ORIGIN_VECTOR }) => {
  return (
    <circle
      fill='red'
      r={2}
      cx={vector.x + originVector.x}
      cy={vector.y + originVector.y}
    />
  )
}

const OuterSlice = ({ slice, originVector = ORIGIN_VECTOR, ...props }) => {
  return (
    <path
      d={`
        ${M(vectorAdd(slice.innerPoint1)(originVector))}

        ${L(vectorAdd(slice.outerPoint1)
                     (ORIGIN_VECTOR))}

        ${A(slice.radius)
           (vectorAdd(slice.outerPoint2)
                     (ORIGIN_VECTOR))
           (calcArcFlag(slice.theta1)(slice.theta2))}

        ${L(vectorAdd(slice.innerPoint2)(originVector))}

        ${outerA(slice.parentSlice.radius)
                (vectorAdd(slice.innerPoint1)
                          (originVector))
                (calcArcFlag(slice.theta1)(slice.theta2))}
      `}
      {...props}
      className='hover:brightness-110 hover:hue-rotate-15'
    />
  )
}

const InnerSlice = ({ slice, originVector = ORIGIN_VECTOR, ...props }) => {

  return (
    <path
      d={`
        ${M(originVector)}
        ${L(vectorAdd(slice.point1)
                     (ORIGIN_VECTOR))}
        ${A(slice.radius)
           (vectorAdd(slice.point2)
                     (ORIGIN_VECTOR))
           (calcArcFlag(slice.theta1)(slice.theta2))}
        ${L(originVector)}
      `}
      {...props}
      className='hover:brightness-110 hover:hue-rotate-180'
    />
  )
}

const Multipie = () => {
  return (
    <div className='w-max h-max border border-green-600'>
      <svg
        className='w-80 h-80'
        viewBox='0 0 100 100'
        stroke='orange'
        fill='grey'
      >

        <InnerSlice slice={slice1} fill='red' />
        <InnerSlice slice={slice2} fill='purple' />
        <InnerSlice slice={slice3} fill='green' />

        <OuterSlice slice={slice1_1} fill='blue' />
        <OuterSlice slice={slice1_2} fill='yellow' />

        <OuterSlice slice={slice3_1} fill='indigo' />
        <OuterSlice slice={slice3_2} fill='pink' />

        {/* <Point vector={slice1_2.point1} />
        <Point vector={slice1_2.point2} /> */}

      </svg>
    </div>
  )
}

export { Multipie }