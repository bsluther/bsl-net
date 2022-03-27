

const xComponent = radians => radius =>
  Math.cos(radians) * radius

const yComponent = radians => radius =>
  Math.sin(radians) * radius

const RADIUS = 15

const degreesToRadians = degrees =>
  degrees * Math.PI / 180



const Pie = () => {
  return (
    <div className='w-max h-max border border-green-600'>
      <svg
        className='w-40 h-40'
        viewBox='-50 -50 100 100'
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
          cx={xComponent(degreesToRadians(0))(RADIUS)}
          cy={yComponent(degreesToRadians(0))(RADIUS)}
        />
        <circle 
          fill='red'
          r={2}
          cx={xComponent(degreesToRadians(-90))(RADIUS)}
          cy={yComponent(degreesToRadians(-90))(RADIUS)}
        />
        <circle 
          fill='red'
          r={2}
          cx={0}
          cy={0}
        />
        <path
          d={`
            M ${xComponent(degreesToRadians(0))(RADIUS)} ${yComponent(degreesToRadians(0))(RADIUS)}
            A ${RADIUS} ${RADIUS} 0 0 0 ${xComponent(degreesToRadians(100))((RADIUS))} ${yComponent(degreesToRadians(100))(RADIUS)}
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
          <Pie />
        </PanePresenter>
      </div>
    </section>
  )
}

export { Main }