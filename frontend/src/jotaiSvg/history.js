import { atom } from 'jotai'
import { addIndex, map, set } from 'ramda'

const mapIx = addIndex(map)

const internalShapeAtomsAtom = atom([])

const historyAtom = atom([])

const saveHistoryAtom = atom(
  null,
  (get, set) => {
    const shapes = map(shapeAtom => get(shapeAtom))
                      (get(internalShapeAtomsAtom))
    set(historyAtom, prev => [shapes, ...prev])
  }
)

const shapeAtomsAtom = atom(
  get => get(internalShapeAtomsAtom),
  (get, set, update) => {
    set(saveHistoryAtom, null)
    set(internalShapeAtomsAtom, update)
  }
)

const undoAtom = atom(
  get => {
    const hasHistory = get(historyAtom).length > 0
    return hasHistory
  },
  (get, set) => {
    const history = get(historyAtom)
    if (history.length > 0) {
      const [shapes, ...rest] = history
      set(internalShapeAtomsAtom,
          prev => 
            mapIx((shape, index) => 
                    get(prev[index]) === shape
                      ? prev[index]
                      : atom(shape))
                 (shapes))
      set(historyAtom, rest)
    }
  }
)

export { shapeAtomsAtom, undoAtom, saveHistoryAtom }