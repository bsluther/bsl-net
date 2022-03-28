import { M, L, A, calcArcFlag, outerA } from './svgFunctions'
import { mathSlices, slices, theorySlices, webdevSlices } from './dataTypes2'
import { Vector, vectorAdd } from './Vector'



const ORIGIN_VECTOR = Vector(50)(50)


const Slice = ({ slice, originVector = ORIGIN_VECTOR, ...props }) => {
  console.log('slice: ', slice)
  return (
    <path
      d={`
        ${M(vectorAdd(slice.innerPoint1)
                     (originVector))}
        ${L(vectorAdd(slice.outerPoint1)
                     (ORIGIN_VECTOR))}
        ${A(slice.outerRadius)
           (vectorAdd(slice.outerPoint2)
                     (ORIGIN_VECTOR))
           (calcArcFlag(slice.theta1)(slice.theta2))}
        ${L(vectorAdd(slice.innerPoint2)
                     (originVector))}

        ${outerA(slice.innerRadius)
                (vectorAdd(slice.innerPoint1)
                          (originVector))
                (calcArcFlag(slice.theta1)(slice.theta2))}
      `}
      {...props}
      className='hover:brightness-110'
    />
  )
}
// oh shit, because I'm not relying on iteration to pass in the starting point, I can reorder the renders to deal with Z position
const Multipie2 = () => {
  return (
    <div className='w-max h-max border border-green-600'>
      <svg
        className='w-80 h-80'
        viewBox='0 0 100 100'
        stroke='orange'
        fill='grey'
      >

        <Slice slice={slices[0]} fill='red' />
        <Slice slice={slices[1]} fill='purple' />
        <Slice slice={slices[2]} fill='green' />
       
        <Slice slice={webdevSlices[0]} fill='blue' /> 
        <Slice slice={webdevSlices[1]} fill='yellow' />

        <Slice slice={mathSlices[0]} fill='pink' /> 
        <Slice slice={mathSlices[1]} fill='indigo' />

        <Slice slice={theorySlices[0]} fill='cyan' /> 
        <Slice slice={theorySlices[1]} fill='brown' />
{/* 
        <OuterSlice slice={slice1_1} fill='blue' />
        <OuterSlice slice={slice1_2} fill='yellow' />

        <OuterSlice slice={slice3_1} fill='indigo' />
        <OuterSlice slice={slice3_2} fill='pink' /> */}

        {/* <Point vector={slice1_2.point1} />
        <Point vector={slice1_2.point2} /> */}

      </svg>
    </div>
  )
}

export { Multipie2 }