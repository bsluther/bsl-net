import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { CategoriesDropdown } from './categoriesDropdown'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
import { getAndStoreBlocks, getAndStoreCategories, postBlock } from './fetches'

/*
TODO:
-put all state into a single Period atom
-set start time to one hour prior to current time
-set end time to current time
-check to make sure end time is after start time
-rename period to block?
*/



const blockAtom = atom({
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

const BlockCreator = ({ categoriesAtom, blocksAtom }) => {
  const [categories, setCategories] = useAtom(categoriesAtom)
  const [block, setBlock] = useAtom(blockAtom)
  const [showErrors, setShowErrors] = useState(false)
  const [_, setBlocks] = useAtom(blocksAtom)

  const startDt = DateTime.fromISO(block.startInstant)
  const endDt = DateTime.fromISO(block.endInstant)
  const startBeforeEnd = endDt.diff(startDt, 'milliseconds').milliseconds > 0
  const filled = !!block.category && !!block.startInstant && !!block.endInstant

  useEffect(() => {
    getAndStoreCategories(setCategories)
  }, [setCategories])


  return (
    <div className={``}>
      <CategoriesDropdown
        nameIdObjs={categories}
        selectedId={L.get('category')(block)}
        selectHandler={id => setBlock(L.set(['category'])(id))}
      />
      <div>
        <div>Start:</div>
        <TimePicker
          instant={L.get(['startInstant'])(block)}
          handler={instant => setBlock(L.set(['startInstant'])(instant))}
        />
      </div>
      <div>
        <div>End:</div>
        <TimePicker
          instant={L.get(['endInstant'])(block)}
          handler={instant => setBlock(L.set(['endInstant'])(instant))}
        />
      </div>
      <button
        className={`
          bg-gray-600 border border-gray-400 rounded-md px-2
          ${filled && startBeforeEnd ? 'text-white' : 'text-gray-400'}
        `}
        onClick={() =>
          filled && startBeforeEnd
            ? postBlock(block)
                .then(() => getAndStoreBlocks(setBlocks))
            : setShowErrors(true)}
      >
        Save Period
      </button>
      {showErrors
        ? <div>
            {startBeforeEnd ? null : <div>Start time must come before end time.</div>}
            {filled ? null : <div>All fields must be filled.</div>}
          </div>
        : null}
    </div>
  )
}

export { BlockCreator }