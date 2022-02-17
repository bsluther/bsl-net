import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { CategoriesDropdown } from './categoriesDropdown'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
import { getAndStoreBlocks, getAndStoreCategories, postBlock } from './fetches'





const blockAtom = atom({
  category: undefined,
  startInstant: DateTime.now().minus({ hour: 2 }).toISO({ suppressMilliseconds: true }),
  endInstant: DateTime.now().toISO({ suppressMilliseconds: true })
})

const TimePicker = ({ instant, handler }) => {
  const dt = DateTime.fromISO(instant)

  return (
    <input
      type='datetime-local'
      className={`border border-black rounded-sm px-1 bg-white`}
      value={dt.toISO({ includeOffset: false })} 
      onChange={e => handler(DateTime.fromISO(e.target.value).toISO())}
    />
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
    <div className={`flex flex-col border-2 border-black rounded-sm bg-hermit-grey-400 w-max m-1 place-items-center`}>
      <div className='flex p-1'>
        <p className='pr-2'>Category:</p>
        <CategoriesDropdown
          nameIdObjs={categories}
          selectedId={L.get('category')(block)}
          selectHandler={id => setBlock(L.set(['category'])(id))}
        />
      </div>
      <div className='flex p-1'>
        <p className='pr-2'>Start:</p>
        <TimePicker
          instant={L.get(['startInstant'])(block)}
          handler={instant => setBlock(L.set(['startInstant'])(instant))}
        />
      </div>
      <div className='flex p-1'>
        <p className='pr-2'>End:</p>
        <TimePicker
          instant={L.get(['endInstant'])(block)}
          handler={instant => setBlock(L.set(['endInstant'])(instant))}
        />
      </div>
      <button
        className={`
          bg-hermit-yellow-403 border border-black rounded-md px-2 m-1 justify-self-center w-max
          ${filled && startBeforeEnd ? 'text-black' : 'text-black'}
        `}
        onClick={() =>
          filled && startBeforeEnd
            ? postBlock(block)
                .then(() => getAndStoreBlocks(setBlocks))
            : setShowErrors(true)}
      >
        Save Block
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