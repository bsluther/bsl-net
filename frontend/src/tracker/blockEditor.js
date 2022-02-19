import { atom, useAtom } from 'jotai'
import { useState } from 'react'
import { CategoriesDropdown } from './categoriesDropdown'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
import { postBlock } from './fetches'
import { postBlockF } from './dbFns'
import { dissoc } from 'ramda'
import { fork } from 'fluture'


const filled = blc =>
  blc && !!blc.user && !!blc.category && !!blc.start.date && !!blc.start.time && !!blc.end.date && !!blc.end.time
const startBeforeEnd = blc => {
  if (!blc) {
    return false
  } else {
    const startDt = DateTime.fromISO(blc.start.date).plus(DateTime.fromISO(blc.start.time))
    const endDt = DateTime.fromISO(blc.end.date).plus(DateTime.fromISO(blc.end.time))
    return endDt.diff(startDt, 'milliseconds').milliseconds > 0
  }
}




const BlockEditor = ({ editingAtom, categories, syncBlocks }) => {
  const [editing, setEditing] = useAtom(editingAtom)
  const [showErrors, setShowErrors] = useState(false)
  console.log('BlockEditor editing:', editing)

  return (
    <div className={`flex flex-col border-2 border-black rounded-sm bg-hermit-grey-400 w-max m-1 place-items-center`}>
      <div className='flex p-1'>
        <p className='pr-2'>Category:</p>
        <CategoriesDropdown
          nameIdObjs={categories}
          selectedId={L.get('category')(editing)}
          selectHandler={id => setEditing(L.set(['category'])(id)(editing))}
        />
      </div>
      <div className='flex p-1'>
        <p className='pr-2'>Start:</p>
        <DatePicker
          isoDate={L.get(['start', 'date'])(editing)}
          handler={date => setEditing(L.set(['start', 'date'], date, editing))}
        />
        <TimePicker
          isoTime={L.get(['start', 'time'])(editing)}
          handler={time => setEditing(L.set(['start', 'time'], time, editing))}
        />
      </div>
      <div className='flex p-1'>
        <p className='pr-2'>End:</p>
        <DatePicker
          isoDate={L.get(['end', 'date'])(editing)}
          handler={date => setEditing(L.set(['end', 'date'], date, editing))}
        />
        <TimePicker
          isoTime={L.get(['end', 'time'])(editing)}
          handler={time => setEditing(L.set(['end', 'time'], time, editing))}
        />
      </div>
      <button
        className={`
          bg-hermit-yellow-403 border border-black rounded-md px-2 m-1 justify-self-center w-max
          ${editing && filled(editing) && startBeforeEnd ? 'text-black' : 'text-black'}
        `}
        onClick={() =>
          editing && filled(editing) && startBeforeEnd
            ? fork(err => console.log('Block post failed!'))
                  (res => syncBlocks())
                  (postBlockF(dissoc('isDraft')(editing)))
            : setShowErrors(true)}
      >
        Save Block
      </button>
      {showErrors
        ? <div>
            {startBeforeEnd ? null : <div>Start time must come before end time.</div>}
            {editing && filled(editing) ? null : <div>All fields must be filled.</div>}
          </div>
        : null}
    </div>
  )
}

const DatePicker = ({ isoDate = DateTime.now().toISODate(), handler = x => x }) => {
  return (
    <input
      type='date'
      className={`border border-black rounded-sm px-1 bg-white`}
      value={isoDate}
      onChange={e => handler(e.target.value)}
    />
  )
}

const TimePicker = ({ isoTime = DateTime.now().toISOTime({ includeOffset: false }), handler }) => {
  return (
    <input
      type='time'
      className={`border border-black rounded-sm px-1 bg-white`}
      value={isoTime}
      onChange={e => handler(e.target.value)}
    />
  )
}



const DateTimePicker = ({ instant, handler }) => {
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

export { BlockEditor }