import { atom, useAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { namedBlocks2Atom, categoriesAtom } from '../atoms'
import { blockStart, maybeStart } from '../block/blockData'
import { maybe, I, pipe } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDoubleDownSvg, PlusSvg } from '../svg'
import { ascend, descend, prop, sortWith, map, values, append, gte, lte, filter, addIndex } from 'ramda'
import { mobileNavHeightAtom } from './MobileNav'
import { isoDateNow } from '../dateTime/functions'
import * as L from 'partial.lenses'
import { DateTime } from 'luxon'
const mapIx = addIndex(map)


const filterConfigsAtom = atom([])

const draftFilterConfigAtom = atomWithReset({
  type: 'date',
  parameter: isoDateNow(),
  logic: 'gte',
  predicate: I
})

const saveDraftAtom = atom(
  null,
  (get, set, arg) => {
    set(filterConfigsAtom, configs => append(get(draftFilterConfigAtom))(configs))
    set(draftFilterConfigAtom, {})
  }
)




const BlockBlob = ({ block }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div className={`border border-hermit-grey-900 space-x-6 w-max rounded-md px-2 bg-hermit-grey-400 h-12`}>
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

const BlobCollection = ({ blocks }) => {
  return (
    <div className={`flex flex-col items-center justify-center px-1 space-y-1`}>
      {map(blc => 
            <BlockBlob block={blc} key={blc._id} />)
          (values(blocks))}
    </div>
  )
}

const CategoryFilter = ({ filterConfig }) => {
  return (
    <div>
      categoryFilter...
    </div>
  )
}

const DateFilter = ({ filterConfig }) => {
  return (
    <div>
      dateFilter...
    </div>
  )
}

const DatePicker = (props) => {
  return (
    <input
      className={`bg-hermit-grey-900 border border-hermit-grey-700 rounded-md h-max`}
      type='date'
      {...props}
    />
  )
}

const DateDialog = ({ endEditing }) => {
  const [draftFilterConfig, setDraftFilterConfig] = useAtom(draftFilterConfigAtom)
  const resetDraft = useResetAtom(draftFilterConfigAtom)
  const [, saveDraft] = useAtom(saveDraftAtom)

  return (
    <div className={`flex flex-col h-full basis-full space-y-4`}>

      <div className={`flex items-center justify-center px-4 space-x-4`}>
        <div className='flex flex-col'>
          <span className='-mb-2'>Show</span>
          <span>data</span>
        </div>
        <select 
          className='bg-hermit-grey-900 border border-hermit-grey-400 rounded-md outline-none'
          onChange={e => setDraftFilterConfig(L.set(['logic'])
                                                   (e.target.value)
                                                   (draftFilterConfig))}
          value='gte'
        >
          <option value='lte'>before</option>
          <option value='gte'>after</option>
        </select>

        <DatePicker 
          value={draftFilterConfig.parameter} 
          onChange={e => setDraftFilterConfig(L.set(['parameter'])
                                                   (e.target.value)
                                                   (draftFilterConfig))}/>
      </div>

      <div className='flex justify-center items-center grow space-x-4'>
        <button 
          className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
          onClick={() => {
            resetDraft()
            endEditing()
          }}
        >Cancel</button>
        <button 
          className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
          onClick={() => {
            if (draftFilterConfig.logic && draftFilterConfig.parameter) {
              saveDraft()
              resetDraft()
              endEditing()
            }
          }}
        >Set Filter</button>
      </div>

    </div>
  )
}

const FilterDialog = ({ endEditing }) => {
  const [filterType, setFilterType] = useState()

  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2
      w-11/12 h-max p-2 space-y-4
      flex flex-col items-center
      text-hermit-grey-400 bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
    `}>
      <div className={`space-x-4 `}>
        <span>Filter by:</span>
        
        <span 
          className={`uppercase px-1 ${filterType === 'date' && `outline outline-hermit-grey-400`}`}
          onClick={() => setFilterType('date')}
        >date</span>
        
        <span>or</span>
        
        <span 
          className={`uppercase px-1 ${filterType === 'category' && `outline outline-hermit-grey-400`}`}
          onClick={() => setFilterType('category')}
        >category</span>
      </div>
      
      {filterType === 'date' 
        ? <div className='grow'>
            <DateDialog 
              endEditing={endEditing}
            /> 
          </div>
        : null}

        {!filterType
          ? <button 
              className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
              onClick={endEditing}
            >Cancel</button>
          : null}

    </div>
  )
}

const AddFilter = () => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <FilterDialog endEditing={() => setEditing(false)} />
    )
  }

  return (
    <div 
      className='w-max border border-hermit-grey-900 rounded-md'
      onClick={() => setEditing(true)}
    >
      <PlusSvg />
    </div>
  )
}

// sort: date ascending, date descending, category
// sort by: date, time, category (choose order)
//  ascending / descending
// filter: date range, category(ies) (exclude / include)


const dateFilterConfigSchema = {
  type: 'date',
  logic: 'gte' || 'lte',
  parameter: 'ISODate',
  predicate: Block => Boolean
}

const log = x => {
  console.log('filterer arg', x)
  return x
}

const predicateHash = {
    gte: param => pipe([
      blockStart,
      maybe(false)(lte(DateTime.fromISO(param))),
      log
    ]),
    lte: param => pipe([
      blockStart,
      maybe(false)(gte(DateTime.fromISO(param)))
    ])
  }

const configToFilter = cfg => blcs => filter(predicateHash[cfg.logic](cfg.parameter))
                                            (blcs)

const BlockRefiner = ({ setRefiner }) => {
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [filterConfigs] = useAtom(filterConfigsAtom)
  const [mobileNavHeight] = useAtom(mobileNavHeightAtom)
  const [blocks, setBlocks] = useAtom(namedBlocks2Atom)

  useEffect(() => {
    const direction = sortDirection === 'ascending' ? ascend : descend
    const sorter = sortWith([
      sortBy === 'date'
        ? direction(maybeStart)
        : direction(prop('categoryName')),
      direction(maybeStart),
      direction(prop('categoryName')) 
    ])

    const filterer = pipe(
      filterConfigs.length === 0 ? [I] : map(configToFilter)(filterConfigs)
    )

    setRefiner(() => pipe([filterer, sorter]))
  }, [sortDirection, sortBy, setRefiner, filterConfigs, blocks])


  return (
    <>
      <div 
        className='bg-hermit-grey-700 flex flex-col border-t border-hermit-grey-900 w-full h-full'>
        <div className={`self-center w-max rounded-md p-1  bg-hermit-grey-700`}>
        
          <div className='pb-1 flex space-x-2'>
            <span>sort by:</span>
            
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={`rounded-md border border-hermit-grey-900 bg-hermit-grey-700 outline-none`}
            >
              <option>category</option>
              <option>date</option>
            </select>
            
            <ChevronDoubleDownSvg 
              className={`transition ease-in-out duration-200 w-5 h-5 
                ${sortDirection === 'ascending' ? '' : 'rotate-180' }
              `}
              onClick={() => setSortDirection(prev => prev === 'descending' ? 'ascending' : 'descending')}
            />
          </div>
  
        </div>

        <div className='relative flex px-2 space-x-2 self-center w-max'>
          <span>filters:</span>

          <div>
            {append(<AddFilter key='addFilter' />)
                   (mapIx((cfg, ix) => cfg.type === 'date' 
                          ? <DateFilter filterConfig={cfg} key={ix} /> 
                          : <CategoryFilter filterConfig={cfg} key={ix} />)
                       (filterConfigs))}
          </div>
        </div>
      </div>

      
    </>
  )
}

const History = () => {
  const [blocks, setBlocks] = useAtom(namedBlocks2Atom)
  const [categories, setCategories] = useAtom(categoriesAtom)
  const [refiner, setRefiner] = useState(() => I)
  console.log(values(blocks))
  return (

    <div className='h-full w-full grid grid-rows-bottomBar'>

      <section className={`flex flex-col space-y-1 pt-4     row-start-1 row-end-2 overflow-scroll`}>
        <BlobCollection blocks={refiner(values(blocks))} />
      </section>

      <div className='row-start-2 row-end-3 overflow-hidden'> 
        <BlockRefiner blocks={values(blocks)} setRefiner={setRefiner} />
      </div>

    </div>
  )
}

export { History }