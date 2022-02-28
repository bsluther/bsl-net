import { atom, useAtom } from 'jotai'
import { map, set } from 'ramda'
import { addShapeAtom } from './SvgShapes'

const dotsAtom = atom([])

const addDotAtom = atom(
  null,
  (get, set, arg) => {
    set(dotsAtom, prev => [...prev, arg])
  }
)

const commitDotsAtom = atom(
  null,
  (get, set) => {
    set(addShapeAtom, get(dotsAtom))
    set(dotsAtom, [])
  }
)

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

export { dotsAtom, addDotAtom, SvgDots, commitDotsAtom }