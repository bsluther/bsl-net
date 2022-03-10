import { useAtom } from 'jotai'
import { categoriesAtom, targetBlockAtom } from '../atoms'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
import { CategoriesDropdown } from '../category/categoriesDropdown'
import { values } from 'ramda'

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

const TimePicker = ({ isoTime = DateTime.now().toISOTime({ includeOffset: false }), handler }) => {
  return (
    <input
      type='time'
      className={`border border-black rounded-sm px-1 bg-hermit-aqua-500 w-32 appearance-none outline-none`}
      value={isoTime}
      onChange={e => handler(e.target.value)}
    />
  )
}

const Field = ({ label, children }) => {
  return (
    <div className={`flex p-1 space-x-2 items-center justify-center`}>
      <span>{label}</span>
      {children}
    </div>
  )
}

const BlockEditor = () => {
  const [block, setBlock] = useAtom(targetBlockAtom)
  const [categories] = useAtom(categoriesAtom)
  return (
    <section className={`flex flex-col space-y-3`}>
      <Field label='Category'>
        <CategoriesDropdown
          className={`bg-hermit-aqua-500 border border-hermit-grey-900 rounded-sm outline-none`}
          nameIdObjs={values(categories)}
          selectedId={block.category}
          selectHandler={id => setBlock(L.set(['category'])
                                             (id))}
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