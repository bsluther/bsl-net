import { useAtom } from 'jotai'
import { categoriesAtom, targetBlockAtom, createNewDraftBlockAtom } from '../atoms'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
import { CategoriesDropdown } from '../category/categoriesDropdown'
import { values } from 'ramda'
import { map, addIndex } from 'ramda'
import { nowSansSeconds } from '../dateTime/functions'
import { useEffect, useRef, useState } from 'react'
import useFontSize from '../../hooks/useFontSize'
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

const NewTag = ({ handleChange }) => {

}

const Tag = ({ tag, handleChange }) => {
  const [editing, setEditing] = useState(false)
  const chars = Math.max(4, tag.length ?? 0)
  const fontSize = useFontSize()
  const w = (fontSize - 4) * chars

  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView(true)
    }
  }, [inputRef])


  if (editing) return (
    <input
      autoFocus
      style={{ width: `${w}px` }}
      className={`border border-hermit-grey-900 bg-hermit-grey-400 outline-none rounded-md px-1`}
      value={tag}
      onChange={e => handleChange(e.target.value)}
      onBlur={() => setEditing(false)}
      ref={inputRef}
    />
  )
  return (
    <span
      className={`w-max border border-hermit-grey-900 rounded-md px-1 appearance-none`}
      onClick={() => setEditing(true)}
    >
      {tag}
    </span>
  )
}

const TagCollection = ({ className, children }) => {
  return (
    <div className={`border border-hermit-grey-900 
      w-full h-full p-1 flex flex-row flex-wrap gap-1 ${className}
    `}>
      {children}
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


const BlockEditor = () => {
  const [block, setBlock] = useAtom(targetBlockAtom)
  const [categories] = useAtom(categoriesAtom)
  const [, createNewDraftBlock] = useAtom(createNewDraftBlockAtom)

  useEffect(() => {
    createNewDraftBlock()
  }, [createNewDraftBlock])

  
  return (
    <section className={`flex flex-col space-y-3`}>
      <Field label='Category'>
        <CategoriesDropdown
          className={`bg-hermit-aqua-500 border border-hermit-grey-900 rounded-sm outline-none`}
          nameIdObjs={values(categories)}
          selectedId={block.category}
          selectHandler={id => setBlock(L.set(['category'])
                                             (id)
                                             (block))}
          title=''
        />
      </Field>
      <Field label='Start'>
        <DatePicker 
          isoDate={L.get(['start', 'date'])(block)}
        />
        <TimePicker 
          isoTime={L.get(['start', 'time'])(block)}
        />
      </Field>

      <Field label='End'>
        <DatePicker 
          isoDate={L.get(['end', 'date'])(block)}
        />
        <TimePicker 
          isoTime={L.get(['end', 'time'])(block)}
        />
      </Field>

      <Field label='Notes'>
        <textarea className={`bg-hermit-aqua-500 focus:bg-hermit-grey-400 border border-hermit-grey-900 rounded-sm outline-none`}/>
      </Field>

      <Field label='Tags'>
        <TagCollection
          className={`max-h-[6rem] w-3/4`}
        >
          {
            block && block.tags && mapIx((tag, ix) => 
                                            <Tag 
                                              tag={tag} 
                                              handleChange={tag => setBlock(L.set(['tags', ix], tag, block))} 
                                              key={ix} />)
                                        (block.tags)
          }
        </TagCollection>
      </Field>
    </section>
  )
}

const Create = () => {
  return(
    <section className={`h-full flex flex-col justify-center`}>
      <BlockEditor />
    </section>
  )
}

export { Create }