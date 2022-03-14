import { useAtom } from 'jotai'
import { get } from 'sanctuary'
import { map, values, dissoc, assoc } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { namedBlocks2Atom } from '../atoms'
import { blockStart } from '../block/blockData'
import { FilterDialog } from '../filtering/FilterDialog2'
import { useFilters } from '../filtering/useFilters'
import { BlockBlob } from './BlockBlob'
import { isTypeof } from '../functions'
 
const BlobCollection = ({ blocks }) => {
  return (
    <div className={`flex flex-col w-full items-center justify-center px-1 space-y-1`}>
      {map(blc => 
            <BlockBlob block={blc} key={blc._id} />)
          (values(blocks))}
    </div>
  )
}

const FilterBlob = ({ filterConfig, handleStartEditing }) => {

  return (
    <div
      className={`border border-hermit-grey-400 rounded-md px-1`}
    >{filterConfig.accessor}</div>
  )
}

const SettingsBar = ({ filters, createFilter, setFilters }) => {
  const [editingFilterId, setEditingFilterId] = useState()
  console.log('editingfilterid', editingFilterId)
  
  const setFilter = useCallback(arg => {
    if (typeof arg === 'function') {
      setFilters(prev => assoc(editingFilterId)
                              (arg(prev[editingFilterId]))
                              (prev))
    }
    if (typeof arg === 'object') {
      setFilters(assoc(editingFilterId)(arg))
    }
  }, [setFilters, editingFilterId])

  const handleSaveFilter = useCallback(() => 
    setEditingFilterId(null)
  , [setEditingFilterId])

  return (
    <div className={`min-w-full w-max h-12 py-2 flex flex-col items-start 
    bg-hermit-grey-700 border-b border-hermit-grey-900`}>
      <div className={`flex w-max px-2 space-x-2 overflow-x-scroll`}>
        <button 
          className={`bg-hermit-grey-900 text-hermit-grey-400 w-max rounded-md px-2 sticky`}
          onClick={() => {
            const newFilterId = createFilter()
            setEditingFilterId(newFilterId)
          }}
        >add filter</button>

        {map(cfg => <FilterBlob filterConfig={cfg} />)
            (values(filters))}
      </div>

      

      {editingFilterId && 

          <FilterDialog 
            filter={filters[editingFilterId]}
            setFilter={setFilter}
            handleCancel={() => {
              setFilters(dissoc(editingFilterId))
              setEditingFilterId(null)
            }}
            handleSave={handleSaveFilter}
          />

      }
    </div>
  )
}

const History = () => { 
  const [blocks] = useAtom(namedBlocks2Atom)
  const [createFilter, filters, setFilters, filterFn] = useFilters({ 
    date: {
      accessor: blockStart,
      accessorKey: 'date',
      licitRelations: ['gte', 'lte']
    }, 
    category: {
      accessor: get(isTypeof('string'))('category'),
      accessorKey: 'category',
      licitRelations: ['include', 'exclude']
    } 
  })
  console.log(filterFn(values(blocks)))

  return (
    <section className='flex flex-col basis-full w-full h-full space-y-2'>
      <SettingsBar filters={filters} createFilter={createFilter} setFilters={setFilters} />
      <BlobCollection blocks={filterFn(values(blocks))} />
    </section>
          

  )
}

export { History }