import { useCallback, useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { map, assoc } from 'ramda'
import { pipe, head, chain, get, fromMaybe } from 'sanctuary'
import { isoDateNow, nowSansSeconds } from '../dateTime/functions'
import { categoriesAtom } from '../atoms'
import { values } from 'ramda'
import { DateTime } from 'luxon'



const relationString = {
  lte: 'before',
  gte: 'after',
  include: 'include',
  exclude: 'exclude'
}

const relationUnstring = {
  after: 'gte',
  before: 'lte',
  include: 'include',
  exclude: 'exclude'
}

const headCategoryId = pipe([
  values,
  head,
  chain(get(x => typeof x === 'string')('_id')),
  fromMaybe('')
])



const CategoriesPicker = ({ valueArray = [], setComparator }) => {
  const [categories] = useAtom(categoriesAtom)

  useEffect(() => 
    setComparator([headCategoryId(categories)])
  , [setComparator, categories])

  return (
    <select 
      className={`bg-hermit-grey-900 border border-hermit-grey-700 outline-none h-8`}
      onChange={e => setComparator([e.target.value])}
      value={fromMaybe('')(head(valueArray))}
    >
      {map(cat => <option value={cat._id} key={cat.name}>{cat.name}</option>)
          (values(categories))}
    </select>
  )
}

const DatePicker = ({ setComparator, dt, ...props}) => {
  const iso = dt ? dt.toISODate() : ''

  useEffect(() => {
    setComparator(DateTime.now().set({ second: 0, millisecond: 0}))
  }, [setComparator])

  return (
    <input
      className={`bg-hermit-grey-900 border border-hermit-grey-700 outline-none h-8`}
      type='date'
      value={iso}
      {...props}
      onChange={e => setComparator(DateTime.fromISO(e.target.value))}
    />
  )
}

const ComparatorPicker = ({ accessor, comparator, setComparator }) => {

  if (accessor === 'date') {
    return (<DatePicker dt={comparator}  setComparator={setComparator} />)
  }
  if (accessor === 'category') {
    return(<CategoriesPicker valueArray={comparator} setComparator={setComparator} />)
  }
  return (
    <></>
  )
}



const RelationPicker = ({ relations, relation, setRelation, children }) => {

  useEffect(() => {
    if (!relation) {
      setRelation(fromMaybe('')(head(relations)))
    }
  }, [setRelation, relation, relations])

  return (
    <div className='flex w-full space-x-2 justify-center'>
      {relations.includes('lte') && 
        <div className='flex flex-col -mt-2'>
          <span>Show </span>
          <span className='pl-2 -mt-2'>data:</span>
        </div>}
      <select 
        className={`bg-hermit-grey-900 outline-none border border-hermit-grey-700`}
        onChange={e => setRelation(relationUnstring[e.target.value])}
        value={relationString[relation]}
      >
      {(map(key => <option key={key}>{relationString[key]}</option>)
           (relations))}
      </select>
      {children}
    </div>
  )
}


const AccessorDropdown = ({ keys = [], onChange, value }) =>
  <select 
    className={`bg-hermit-grey-900 outline-none border border-hermit-grey-700`}
    onChange={onChange}
    value={value}
  >
    {(map(key => <option  key={key}>{key}</option>)
         (keys))}
  </select>

const AccessorPicker = ({ keys, accessor, setAccessor }) => {

  return (
    <div className='space-x-4'>
      <span>Filter by</span>
      <AccessorDropdown 
        keys={keys}
        onChange={e => setAccessor(e.target.value)}
        value={accessor}
      />
    </div>
  )
}

const Button = ({ children, ...props }) => 
  <button 
    className={`bg-hermit-grey-700 border border-hermit-grey-400 px-1 rounded-sm`}
    {...props}
  >{children}</button>

const FilterDialog = ({ filter, setFilter, handleCancel, handleSave }) => {
  const setComparator = useCallback(x => setFilter(assoc('comparator')(x)), [setFilter])
  const setRelation = useCallback(x => setFilter(assoc('relation')(x)), [setFilter])

  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2
      min-w-max max-w-11/12 h-max p-2 space-y-4
      flex flex-col items-center
      text-hermit-grey-400 bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
    `}>
      <AccessorPicker
        keys={['date', 'category']}
        accessor={filter.accessor}
        setAccessor={x => setFilter(pipe([
          assoc('accessor')(x),
          assoc('comparator')(undefined),
          assoc('relation')(undefined)
        ]))}
      />
      {filter.accessor && 
        <RelationPicker
          relations={filter.accessor === 'date' ? ['lte', 'gte'] : ['include', 'exclude']}
          relation={filter.relation}
          setRelation={setRelation}
        >
         <ComparatorPicker 
            accessor={filter.accessor}
            comparator={filter.comparator}
            setComparator={setComparator}
          /> 
        </RelationPicker>}

      <div className={`flex max-w-full min-w-max space-x-12`}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Set Filter</Button>
      </div>
    </div>
  )
}


export { FilterDialog }