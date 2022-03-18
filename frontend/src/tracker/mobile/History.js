import { useAtom } from 'jotai'
import { assoc, dissoc, map, values } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { get, concat, joinWith, pipe, prop, fromMaybe } from 'sanctuary'
import { categoriesAtom, namedBlocksAtom, targetBlockIdAtom } from '../atoms'
import { blockStart } from '../block/blockData'
import { toFormat } from '../dateTime/pointfree'
import { FilterDialog } from '../filtering/FilterDialog'
import { useFilters } from '../filtering/useFilters'
import { isTypeof } from '../functions'
import { PlusSvg } from '../svg'
// import { BlockBlob, ExpandableBlockBlob } from './BlockBlob'
import { ExpandableBlobCollection, TableBlockBlob } from './blockBlob/ExpandableBlobCollection'
import * as L from 'partial.lenses'

// note that that looks like promapping... aka lensing...
const BlobCollection = ({ blocks, setBlocks, setTargetBlockId }) => {

  return (
    <div className={`flex flex-col w-full items-center justify-center px-1 space-y-1`}>
      {map(blc => 
            <TableBlockBlob 
              block={blc}
              setBlock={arg => {
                if (typeof arg === 'function') {
                  setBlocks(prev => L.set([blc._id])
                                         (arg(L.get([blc._id])
                                                   (prev)))
                                         (prev))
                }
                if (typeof arg !== 'function') {
                  setBlocks(prev => L.set([blc._id])
                                         (arg)
                                         (prev))
                }
              }}
              key={blc._id} 
              setTargetBlockId={setTargetBlockId}

            />)
          (values(blocks))}
    </div>
  )
}

const relationSymbolHash = {
  lte: '≤',
  gte: '≥',
  include: '=',
  exclude: '≠'
}

const RelationSymbol = ({ relation }) => {

  return (
    <span className='w-max h-max'>
      {relationSymbolHash[relation]}
    </span>
  )
}

// accessor lets us know what the data type is
// comparator is the actual data which we need to process somehow
const ComparatorSpan = ({ accessor, comparator }) => {
  const [categories] = useAtom(categoriesAtom)
  const catIdToName = categories => id => pipe([
    get(isTypeof('object'))(id),
    map(prop('name')),
    fromMaybe('')
  ])(categories)

  if (accessor === 'date') {
    return (
      <span>
        {toFormat('M/d/yy')(comparator)}
      </span>
    )
  }

  const ellipsize = str =>
    str.length > 3
      ? concat(str.slice(0, 3))('...')
      : str

  if (accessor === 'category') {
    // console.log('!!!', map(pipe([catIdToName(categories), ellipsize]))(comparator))
    return (
      <span>
        {joinWith(', ')(map(pipe([catIdToName(categories), ellipsize]))(comparator))}
      </span>
    )
  }

  return <></>
}

const FilterBlob = ({ filterConfig, handleStartEditing }) => {
  
  return (
    <div 
      className='border border-hermit-grey-900 text-hermit-grey-400 rounded-md px-1 space-x-1 flex justify-center'
      onClick={() => handleStartEditing(filterConfig.id)}
    >
      <span>{filterConfig.accessor}</span>
      <RelationSymbol relation={filterConfig.relation} />
      {filterConfig.comparator && filterConfig.accessor && 
        <ComparatorSpan comparator={filterConfig.comparator} accessor={filterConfig.accessor}/>
      }
    </div>
  )
}

const SettingsBar = ({ filters, createFilter, setFilters }) => {
  const [editingFilterId, setEditingFilterId] = useState()
  
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
    <div className={`min-w-full w-max h-max py-2 flex flex-col items-start 
    bg-hermit-grey-700 border-b border-hermit-grey-900`}>
      <div className={`flex w-max px-2 space-x-2 overflow-x-scroll`}>

        <span>Filters:</span>

        {map(cfg => <FilterBlob filterConfig={cfg} key={cfg.id} handleStartEditing={setEditingFilterId} />)
            (values(filters))}

        <PlusSvg 
          className={`bg-hermit-grey-900 text-hermit-grey-400 w-6 h-6 rounded-md`}
          onClick={() => {
            const newFilterId = createFilter()
            setEditingFilterId(newFilterId)
          }}
        ></PlusSvg>

        
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
  const [blocks, setBlocks] = useAtom(namedBlocksAtom)

  const [createFilter, filters, setFilters, filterFn] = useFilters({ 
    date: {
      accessor: blockStart,
      comparatorType: 'CategoryID',
      accessorKey: 'date',
      licitRelations: ['gte', 'lte']
    }, 
    category: {
      accessor: get(isTypeof('string'))('category'),
      comparatorType: 'CategoryID',
      accessorKey: 'category',
      licitRelations: ['include', 'exclude']
    } 
  })

  return (
    <section className='flex flex-col basis-full w-full h-full space-y-2'>
      <SettingsBar filters={filters} createFilter={createFilter} setFilters={setFilters} />
      <div className={`flex w-full h-max justify-center pb-72`}>
        <ExpandableBlobCollection
          blocks={filterFn(values(blocks))} 
          setBlocks={setBlocks}
        />
      </div>
    </section>
          

  )
}

export { History }
