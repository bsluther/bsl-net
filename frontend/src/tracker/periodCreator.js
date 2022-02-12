import { atom, useAtom } from 'jotai'
import { useEffect, useState, useMemo } from 'react'
import { CategoriesDropdown } from './categoriesDropdown'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'

/*
TODO:
-put all state into a single Period atom
-set start time to one hour prior to current time
-set end time to current time
-check to make sure end time is after start time
-rename period to block?
*/

const stripOffset = iso => DateTime.fromISO(iso).toISO({ includeOffset: false })

const categoriesAtom = atom([])

const periodAtom = atom({
  category: undefined,
  startInstant: DateTime.now().minus({ hour: 2 }).toISO({ suppressMilliseconds: true }),
  endInstant: DateTime.now().toISO({ suppressMilliseconds: true })
})

const TimePicker = ({ instant, handler }) => {
  const dt = DateTime.fromISO(instant)

  return (
    <input type='datetime-local' className={`border border-black rounded-sm px-1`} value={dt.toISO({ includeOffset: false })} onChange={e => handler(DateTime.fromISO(e.target.value).toISO())}/>
  )
}
const PeriodCreator = () => {
  const [categories, setCategories] = useAtom(categoriesAtom)
  const [period, setPeriod] = useAtom(periodAtom)
  const [offset, setOffset] = useState()
  // const startBeforeEnd =

  console.log(period)

  useEffect(() => {
    setOffset(DateTime.now().offset)
  }, [setOffset])

  useEffect(() => {
    fetch('./tracker/categories')
    .then(res => res.json())
    .then(data => setCategories(data))
  }, [setCategories])

  return (
    <div className={``}>
      <CategoriesDropdown
        nameIdObjs={categories}
        selectedId={L.get('category')(period)}
        selectHandler={id => setPeriod(L.set(['category'])(id))}
      />
      <div>
        <div>Start:</div>
        <TimePicker
          instant={L.get(['startInstant'])(period)}
          handler={instant => setPeriod(L.set(['startInstant'])(instant))}
        />
      </div>
      <div>
        <div>End:</div>
        <TimePicker
          instant={L.get(['endInstant'])(period)} handler={x => x}
          handler={instant => setPeriod(L.set(['endInstant'])(instant))}
        />
      </div>
    </div>
  )
}

export { PeriodCreator }