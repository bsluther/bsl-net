import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { categoriesAtom, createNewDraftBlockAtom, targetBlockAtom } from '../atoms'
import { Validation } from '../../Villa/Validation'
import { CategoriesDropdown } from '../category/categoriesDropdown'
import { assoc } from 'ramda'
import { values } from 'ramda'
import { DateTime } from 'luxon'
import * as L from 'partial.lenses'
import { ChevronDown, ChevronLeft } from '../svg'
import { Collapsable } from '../Collapsable'

/*
Validation:
-start before end
-valid dates and times
-user filled
-category filled
*/

const DatePicker = ({ isoDate = DateTime.now().toISODate(), handler = x => x }) => {
  return (
    <input
      type='date'
      className={`w-40 border border-black rounded-sm px-1 bg-white`}
      value={isoDate}
      onChange={e => handler(e.target.value)}
    />
  )
}

const TimePicker = ({ isoTime = DateTime.now().toISOTime({ includeOffset: false }), handler }) => {
  return (
    <input
      type='time'
      className={`border border-black rounded-sm px-1 bg-white w-32`}
      value={isoTime}
      onChange={e => handler(e.target.value)}
    />
  )
}

const Field = ({ label, children }) => {
  return (
    <div className={`flex p-1 space-x-2`}>
      <span>{label}</span>
      {children}
    </div>
  )
}

const EditorPresenter = ({ block, setBlock, categories }) => {

  return (
    <section className={`
      bg-hermit-grey-400 border-b-2 border-x-2 border-hermit-grey-900
    `}>
      <Field label='Category:'>
        <CategoriesDropdown 
          selectedId={block.category}
          selectHandler={catId => setBlock(assoc('category')(catId)(block))}
          nameIdObjs={values(categories)} 
        />
      </Field>

      <Field label='Start:'>
        <DatePicker 
          isoDate={L.get(['start', 'date'])(block)}
        />
        <TimePicker 
          isoTime={L.get(['start', 'time'])(block)}
        />
      </Field>

      <Field label='End:'>
        <DatePicker 
          isoDate={L.get(['end', 'date'])(block)}
        />
        <TimePicker 
          isoTime={L.get(['end', 'time'])(block)}
        />
      </Field>

      <Field label='Notes:'>
        <textarea className={`border border-hermit-grey-900 w-72`} />
      </Field>

      <Field label='Tags:'>
        <input className={`border border-hermit-grey-900`} />

      </Field>

    </section>
  )
}



const EditorState = () => {
  const [categories] = useAtom(categoriesAtom)
  const [targetBlock, setTargetBlock] = useAtom(targetBlockAtom)
  const [, createNewDraftBlock] = useAtom(createNewDraftBlockAtom)
  console.log(targetBlock)

  useEffect(createNewDraftBlock, [createNewDraftBlock])

  return (
    <Collapsable
      title='Block Editor'
    >
      <EditorPresenter
        block={targetBlock}
        setBlock={setTargetBlock}
        categories={categories}
      />
    </Collapsable>
  )
}

export { EditorState as BlockEditor2 }