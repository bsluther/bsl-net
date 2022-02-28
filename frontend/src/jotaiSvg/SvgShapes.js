import { atom, useAtom } from 'jotai'
import { filter, map } from 'ramda'
import { selectAtom, selectedAtom, unselectAtom } from './selection'
import { createShapeAtom, SvgShape } from './SvgShape'
import { shapeAtomsAtom } from './history'

// const shapeAtomsAtom = atom([])

const addShapeAtom = atom(
  null,
  (get, set, arg) => {
    const shapeAtom = createShapeAtom(arg)
    set(shapeAtomsAtom, prev =>
      ([...prev, shapeAtom]))
    set(selectAtom, shapeAtom)
  }
)

const deleteSelectedShapeAtom = atom(
  get => !!get(selectedAtom),
  (get, set) => {
    const selected = get(selectedAtom)
    if (selected) {
      set(shapeAtomsAtom,
          filter(item => item !== selected)
                (get(shapeAtomsAtom)))
    }
  }
)

const SvgShapes = () => {
  const [shapeAtoms] = useAtom(shapeAtomsAtom)

  return (
    <g>
      {map(shapeAtom =>
            <SvgShape
              key={`${shapeAtom}`}
              shapeAtom={shapeAtom}
            />)
          (shapeAtoms)}
    </g>
  )
}

export { addShapeAtom, SvgShapes, deleteSelectedShapeAtom }