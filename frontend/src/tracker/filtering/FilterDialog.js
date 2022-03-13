import { useState } from 'react'
import { atom, useAtom } from 'jotai'



const filterAtoms = atom([])

const createFilter = () => ({
  relation: undefined,
  comparator: undefined,
  accessor: undefined
})





const AccessorOption = ({ label, isActive, handleClick }) =>
  <span>{label}</span>

const AccessorPicker = ({ accessor, setAccessor }) => {
  return (
    <div>
      Filter by
      <AccessorOption 
        label='date'
        isActive={accessor}
      />
    </div>
  )
}

const FilterDialog = ({ saveFilterConfig, endEditing }) => {
  const [comparator, setComparator] = useState()
  const [relation, setRelation] = useState()
  const [accessor, setAccessor]= useState()
  // console.log(createFilter())

  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2
      w-11/12 h-max p-2 space-y-4
      flex flex-col items-center
      text-hermit-grey-400 bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
    `}>
      <AccessorPicker 
        accessor={accessor}
        setAccessor={setAccessor}
      />
      <button onClick={() => createFilter()}>create filter</button>
    </div>
  )
}

const Filterer = ({ setFilter, dialogOpen = true }) => {
  const [filters, setFilters] = useAtom(filterAtoms)

  return (
    <>
      {dialogOpen && <FilterDialog />}
    </>
  )
}

export { Filterer }