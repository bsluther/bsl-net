import { atom, useAtom,  } from 'jotai'
import { map } from 'ramda'
import { useLayoutEffect, useState, useRef, useEffect } from 'react'

/****** ATOMS ******/

const dotsAtom = atom([])

const numberOfDotsAtom = atom(
  get => get(dotsAtom).length
)

const handleMouseMoveAtom = atom(
  null,
  (get, set, _arg) => {
    if (get(drawingAtom)) {
      set(dotsAtom, prev => [...prev, _arg])
    }
  }
)

const drawingAtom = atom(false)

const handleMouseDownAtom = atom(
  null,
  (get, set) => set(drawingAtom, true)
)

const handleMouseUpAtom = atom(
  null,
  (get, set) => set(drawingAtom, false)
)


/****** HOOKS ******/

const useCommitCount = () => {
  const commitCountRef = useRef(0)
  useEffect(() => {
    commitCountRef.current += 1
  })
  return commitCountRef.current
}

const useYCorrection = () => {
  const [yCorrection, setYCorrection] = useState(0)
  const rootRef = useRef()

  useLayoutEffect(() => {
    setYCorrection(rootRef.current.getBoundingClientRect().y)
  }, [rootRef])

  return [rootRef, yCorrection]
}



/****** COMPONENTS ******/

const SvgDots = () => {
  const [dots] = useAtom(dotsAtom)

  return (
    <g>
      {map(([x, y]) =>
              <circle cx={x} cy={y} r='2' fill='#aaa'/>)
          (dots)}
    </g>
  )
}



const SvgRoot = () => {
  const [, handleMouseMove] = useAtom(handleMouseMoveAtom)
  const [, handleMouseDown] = useAtom(handleMouseDownAtom)
  const [, handleMouseUp] = useAtom(handleMouseUpAtom)

  const [rootRef, yCorrection] = useYCorrection()

  return (
    <svg
      width='200'
      height='200'
      viewBox='0 0 200 200'
      onMouseMove={e => {
        const p = [e.clientX, e.clientY - yCorrection]
        handleMouseMove(p)
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={rootRef}
    >
      <rect width='200' height='200' fill='#eee' />
      <text x='3' y='12' fontSize='12px' className='select-none'>
        Commits: {useCommitCount()}
      </text>
      <SvgDots />
    </svg>
  )
}

const Stats = () => {
  const [numberOfDots] = useAtom(numberOfDotsAtom)
  return (
    <ul>
      <li>Dots: {numberOfDots}</li>
    </ul>
  )
}

const SvgApp = () => {
  return (
    <>
      <SvgRoot />
      <Stats />
    </>
  )
}

export { SvgApp }