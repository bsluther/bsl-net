import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'
import { selectAtom, selectedAtomCreator } from './selection'


const pointsToPath = points => {
  let d = ''
  points.forEach(p => {
    if (d) {
      d += ` L ${p[0]} ${p[1]}`
    } else {
      d = `M ${p[0]} ${p[1]}`
    }
  })
  return d
}

const createShapeAtom = points => atom({ path: pointsToPath(points) })

// const addShapeAtom = atom(
//   null,
//   (get, set, arg) => {
//     console.log(pointsToPath(arg))
//     set(shapeAtom, { path: pointsToPath(arg) })
//   }
// )

const SvgShape = ({ shapeAtom }) => {
  const [shape] = useAtom(shapeAtom)
  const [, select] = useAtom(selectAtom)
  const [selected] = useAtom(
    useMemo(() => selectedAtomCreator(shapeAtom), [shapeAtom])
  )

  return (
    <g onClick={() => select(shapeAtom)}>
      <path
        d={shape.path}
        fill='none'
        opacity={selected ? '0.3' : '0'}
        stroke='red'
        strokeWidth='12'
      />
      <path 
        d={shape.path}
        fill='none'
        stroke={shape.color || 'black'}
        strokeWidth='3'
      />
    </g>
  )
}

export { createShapeAtom, SvgShape }