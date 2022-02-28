import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { SvgDots, dotsAtom, commitDotsAtom } from './SvgDots'
import { SvgShapes } from './SvgShapes'


const drawingAtom = atom(false)

const handleMouseDownAtom = atom(
  null,
  (get, set) => set(drawingAtom, true)
)

const handleMouseUpAtom = atom(
  null,
  (get, set) => {
    set(drawingAtom, false)
    set(commitDotsAtom, null)
  }
)

const handleMouseMoveAtom = atom(
  null,
  (get, set, _arg) => {
    if (get(drawingAtom)) {
      set(dotsAtom, prev => [...prev, _arg])
    }
  }
)

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
      // onMouseMove={e => {
      //   const p = [e.clientX, e.clientY - yCorrection]
      //   handleMouseMove(p)
      // }}
      // alternate method:
      onMouseMove={e => {
        const { x, y } = e.currentTarget.getBoundingClientRect()
        handleMouseMove([e.clientX - x, e.clientY - y])
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={rootRef}
    >
      <rect width='200' height='200' fill='#eee' />
      <text x='3' y='12' fontSize='12px' className='select-none'>
        Commits: {useCommitCount()}
      </text>
      <SvgShapes />
      <SvgDots />
    </svg>
  )
}

export { SvgRoot }