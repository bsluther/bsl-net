import { atom } from 'jotai'
import { saveHistoryAtom } from './history'


const selectedShapeAtomAtom = atom()

// "Delegation"
const selectAtom = atom(
  null,
  (get, set, shapeAtom) => {
    set(selectedShapeAtomAtom, shapeAtom)
  }
)

const selectedAtomCreator = shapeAtom => {
  const selectedAtom = atom(
    get => shapeAtom === get(selectedShapeAtomAtom)
  )
  return selectedAtom
}

const setColorAtom = atom(
  get => {
    const selectedShapeAtom = get(selectedShapeAtomAtom)
    if (selectedShapeAtom) {
      return get(selectedShapeAtom).color || ''
    }
    return null
  },
  (get, set, color) => {
    const selectedShapeAtom = get(selectedShapeAtomAtom)
    if (selectedShapeAtom) {
      set(saveHistoryAtom, null)
      set(selectedShapeAtom,
          prev => ({ ...prev, color }))
    }
  }
)

const selectedAtom = atom(
  get => get(selectedShapeAtomAtom)
)

const unselectAtom = atom(
  null,
  (get, set) => {
    set(selectedShapeAtomAtom, null)
  }
)

export { selectAtom, selectedAtomCreator, setColorAtom, selectedAtom, unselectAtom }