import { append } from 'ramda'
import { isoDateNow } from '../dateTime/functions'
import { I } from 'sanctuary'
import { atomWithReset } from 'jotai/utils'
import { atom } from 'jotai'

const filterConfigsAtom = atom([])

const draftFilterConfigAtom = atomWithReset({
  type: 'date',
  parameter: isoDateNow(),
  logic: 'gte',
  predicate: I
})

const saveDraftFilterConfigAtom = atom(
  null,
  (get, set, arg) => {
    set(filterConfigsAtom, configs => append(get(draftFilterConfigAtom))(configs))
    set(draftFilterConfigAtom, {})
  }
)

export { filterConfigsAtom, draftFilterConfigAtom, saveDraftFilterConfigAtom }