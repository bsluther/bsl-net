import { Multipie } from '../../../bslnet/multipie/Multipie'
import { Multipie2 } from '../../../bslnet/multipie/Multipie2'

const xComponent = radians => radius =>
  Math.cos(radians) * radius

const yComponent = radians => radius =>
  Math.sin(radians) * radius

const TIER1RADIUS = 25
const TIER2RADIUS = 40

const degreesToRadians = degrees =>
  degrees * Math.PI / 180

const SLICE1 = {
  theta1: degreesToRadians(0),
  theta2: degreesToRadians(-90)
}







const Pie = () => {
  return (
    <div className='w-max h-max border border-green-600'>
      <svg
        className='w-80 h-80'
        viewBox='0 0 100 100'
        stroke='orange'
        fill='grey'
      >
        {/* <circle
          cx='50'
          cy='50'
          r='25'
          className={`bg-blue-700`}>
        </circle> */}
        {/* <path
          d='M 50 50 L 60 60'
        /> */}
        {/* <path 
          d='M 50 50
             A 20 20 0 0 0 10 50 
            '
        />
        <path 
          d='M 50 50
             a 20 20 0 0 0 40 0 
            '
        /> */}
        <circle 
          fill='red'
          r={2}
          cx={xComponent(degreesToRadians(0))(TIER1RADIUS) + 50}
          cy={yComponent(degreesToRadians(0))(TIER1RADIUS) + 50}
        />
        <circle 
          fill='red'
          r={2}
          cx={xComponent(degreesToRadians(-90))(TIER1RADIUS) + 50}
          cy={yComponent(degreesToRadians(-90))(TIER1RADIUS) + 50}
        />
        <circle 
          fill='red'
          r={2}
          cx={50}
          cy={50}
        />
        <path
          fill='green'
          d={`
            M 50 50
            L ${xComponent(SLICE1.theta1)(TIER1RADIUS) + 50} ${yComponent(SLICE1.theta1)(TIER1RADIUS) + 50}
            A ${TIER1RADIUS} ${TIER1RADIUS} 0 0 0 ${xComponent(SLICE1.theta2)((TIER1RADIUS)) + 50} ${yComponent(SLICE1.theta2)(TIER1RADIUS) + 50}
            M 50 50
          `}
        />

        <path
          fill='yellow'
          d={`
            M ${xComponent(SLICE1.theta1)(TIER1RADIUS) + 50} ${yComponent(SLICE1.theta1)(TIER1RADIUS) + 50}
            L ${xComponent(SLICE1.theta1)(TIER2RADIUS) + 50} ${yComponent(SLICE1.theta1)(TIER2RADIUS) + 50}
            A ${TIER2RADIUS} ${TIER2RADIUS} 0 0 0 ${xComponent(SLICE1.theta2)((TIER2RADIUS)) + 50} ${yComponent(SLICE1.theta2)(TIER2RADIUS) + 50}
            L ${xComponent(SLICE1.theta2)((TIER1RADIUS)) + 50} ${yComponent(SLICE1.theta2)(TIER1RADIUS) + 50}
            A ${TIER1RADIUS} ${TIER1RADIUS} 0 0 1 ${xComponent(SLICE1.theta1)(TIER1RADIUS) + 50} ${yComponent(SLICE1.theta1)(TIER1RADIUS) + 50}
          `}
        />

        <path
          fill='blue'
          d={`
            M 50 50
            L ${xComponent(degreesToRadians(-90))(TIER1RADIUS) + 50} ${yComponent(degreesToRadians(-90))(TIER1RADIUS) + 50}
            A ${TIER1RADIUS} ${TIER1RADIUS} 0 0 0 ${xComponent(degreesToRadians(170))((TIER1RADIUS)) + 50} ${yComponent(degreesToRadians(170))(TIER1RADIUS) + 50}
            L 50 50
          `}
        />
        <path
          fill='purple'
          d={`
            M 50 50
            L ${xComponent(degreesToRadians(170))(TIER1RADIUS) + 50} ${yComponent(degreesToRadians(170))(TIER1RADIUS) + 50}
            A ${TIER1RADIUS} ${TIER1RADIUS} 0 0 0 ${xComponent(degreesToRadians(0))((TIER1RADIUS)) + 50} ${yComponent(degreesToRadians(0))(TIER1RADIUS) + 50}
            L 50 50
          `}
        />
      </svg>
    </div>
  )
}

const PanePresenter = ({ children }) => {
  return (
    <div className='h-full border-2 border-hermit-grey-900 p-4'>
      {children}
    </div>
  )
}

const Main = () => {

  return (
    <section className='w-full h-full overflow-hidden flex items-center justify-center'>
      <div className='w-[95%] h-[95%]'>
        <PanePresenter>
          <Multipie2 />
          <Multipie />
        </PanePresenter>
      </div>
    </section>
  )
}

export { Main }