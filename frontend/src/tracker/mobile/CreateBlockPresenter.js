import { DateTime } from 'luxon'
import { remove, append, update, addIndex, map } from 'ramda'
import { useState, useRef, useEffect } from 'react'
import useFontSize from '../../hooks/useFontSize'
import { categoriesAtom } from '../atoms'
import { AtomicCategoriesDropdown } from '../category/categoriesDropdown'
import { nowSansSeconds } from '../dateTime/functions'
import { PlusSvg } from '../svg'
const mapIx = addIndex(map)

const DatePicker = ({ isoDate = DateTime.now().toISODate(), handler = x => x }) => {
  return (
    <input
      type='date'
      className={`w-40 border border-black rounded-sm px-1 bg-hermit-aqua-500 appearance-none outline-none`}
      value={isoDate}
      onChange={e => handler(e.target.value)}
    />
  )
}

const TimePicker = ({ isoTime = nowSansSeconds(), handler }) => {
  return (
    <input
      type='time'
      className={`border border-black rounded-sm px-1 bg-hermit-aqua-500 w-32 appearance-none outline-none`}
      value={isoTime}
      onChange={e => handler(e.target.value)}
    />
  )
}

const NewTag = ({ handleNewTag }) => {
  const [newTag, setNewTag] = useState('')
  const [editing, setEditing] = useState(false)
  const chars = Math.max(4, newTag.length ?? 0)
  const fontSize = useFontSize()
  const w = (fontSize - 4) * chars
  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current && editing) {
      inputRef.current.focus()
    }
  }, [inputRef, editing])

  if (editing) return (
    <input
      style={{ width: `${w}px` }}
      className={`border border-hermit-grey-900 bg-hermit-grey-400 outline-none rounded-md px-1`}
      value={newTag}
      onChange={e => setNewTag(e.target.value)}
      onBlur={() => {
        if (newTag.length > 0) {
          handleNewTag(newTag)
          setNewTag('')
        }
        setNewTag('')
        setEditing(false)
      }}
      ref={inputRef}
    />
  )

  return (
    <span
      className={`flex w-max border border-hermit-grey-900 bg-hermit-aqua-200 rounded-md px-1 items-center`}
      onClick={() => setEditing(true)}
    >
      <PlusSvg strokeWidth={1.5} className='w-5 h-5' />
    </span>
  )
}

const Tag = ({ tag, handleChange, handleRemove }) => {
  const [editing, setEditing] = useState(false)
  const chars = Math.max(4, tag.length ?? 0)
  const fontSize = useFontSize()
  const w = (fontSize - 4) * chars

  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current && editing) {
      inputRef.current.focus()
    }
  }, [inputRef, editing])


  if (editing) return (
    <input
      style={{ width: `${w}px` }}
      className={`border border-hermit-grey-900 bg-hermit-grey-400 outline-none rounded-md px-1`}
      value={tag}
      onChange={e => handleChange(e.target.value)}
      onBlur={() => {
        setEditing(false)
        if (tag.length === 0) {
          handleRemove()
        }
        window.scrollTo({ top: 0 })
      }}
      ref={inputRef}
    />
  )
  return (
    <span
      className={`w-max border border-hermit-grey-900 rounded-md px-1`}
      onClick={() => setEditing(true)}
    >
      {tag}
    </span>
  )
}

const Tags = ({ tags, tagsHandler }) => {
  return (
    <div className={`border border-hermit-grey-900 
      w-3/4 h-full max-h-[6rem] p-1 flex flex-wrap gap-1 overflow-y-scroll 
    `}>
      {
        append(<NewTag 
          handleNewTag={tag => tagsHandler(append(tag)(tags))} 
          key='newTag' />)
              (mapIx((tag, ix) => 
                        <Tag 
                          tag={tag} 
                          handleChange={tag => tagsHandler(update(ix)(tag)(tags))} 
                          handleRemove={() => tagsHandler(remove(ix)(ix + 1)(tags))}
                          key={ix} />)
                    (tags))
      }
    </div>
  )
}

const Field = ({ label, children }) => {
  return (
    <div className={`flex p-1 space-x-2 items-center justify-center max-w-full`}>
      <span>{label}</span>
      {children}
    </div>
  )
}

const CreateBlockPresenter = ({
  isInvalid,
  category = '',
  categoryHandler,
  startDate = '',
  startDateHandler,
  startTime = '',
  startTimeHandler,
  endDate = '',
  endDateHandler,
  endTime = '',
  endTimeHandler,
  notes = '',
  notesHandler,
  tags = [],
  tagsHandler,
  cancelDraftHandler = x => x,
  saveDraftHandler = x => x
}) => {

  return (
    <section className={`flex flex-col space-y-3`}>
      <Field label={'Category'}>
        <AtomicCategoriesDropdown 
          className={`bg-hermit-aqua-500 border border-hermit-grey-900 rounded-sm outline-none`}
          categoriesAtom={categoriesAtom}
          selectedId={category}
          selectHandler={categoryHandler}
        />
      </Field>
      <Field label='Start'>
        <DatePicker 
          isoDate={startDate}
          handler={startDateHandler}
        />
        <TimePicker 
          isoTime={startTime}
          handler={startTimeHandler}
        />
      </Field>

      <Field label='End'>
        <DatePicker 
          isoDate={endDate}
          handler={endDateHandler}
        />
        <TimePicker 
          isoTime={endTime}
          handler={endTimeHandler}
        />
      </Field>

      <Field label='Notes'>
        <textarea 
          className={`w-3/4 max-h-24 bg-hermit-aqua-500 focus:bg-hermit-grey-400 border border-hermit-grey-900 rounded-sm outline-none`}
          value={notes}
          onChange={e => notesHandler(e.target.value)}
        />
      </Field>

      <Field label='Tags'>
        <Tags 
          tags={tags}
          tagsHandler={tagsHandler}
        />
      </Field>

      <div className='self-center grow space-x-4'>
        <button 
          className={`text-hermit-grey-400 bg-hermit-grey-900 rounded-md w-max px-2`} 
          onClick={cancelDraftHandler}
        >Discard</button>
        <button
          disabled={isInvalid}
          className={`bg-hermit-grey-900 rounded-md w-max px-2
            ${isInvalid ? 'text-hermit-grey-700' : 'text-hermit-grey-400'}
          `}
          onClick={saveDraftHandler}
        >Save</button>
      </div>

    </section>
  )
}

export { CreateBlockPresenter }