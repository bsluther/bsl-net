import { useAtom } from 'jotai'
import { namedBlocks2Atom, categoriesAtom } from '../atoms'
import { blockEnd, blockStart, maybeStart } from '../block/blockData'
import { maybe, I } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDoubleDownSvg, PlusSvg, SwitchVerticalSvg } from '../svg'
import { ascend, descend, prop, sortWith, map, values, append } from 'ramda'
import { mobileNavHeightAtom } from './MobileNav'
import { isoDateNow, nowSansSeconds } from '../dateTime/functions'








const BlockBlob = ({ block }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div className={`border border-hermit-grey-900 space-x-6 w-max rounded-md px-2 bg-hermit-grey-400`}>
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

const DatePicker = ({ isoDate = isoDateNow() }) => {
  return (
    <input
      className={`bg-hermit-grey-900 border border-hermit-grey-700 rounded-md h-max`}
      type='date'
      value={isoDate}
    />
  )
}

const DateDialog = () => {
  return (
    <div className={`flex flex-col h-full`}>

      <div className={`flex items-center pt-2 px-4`}>
        <div className='grow flex flex-col items-center'>
          <span className={`uppercase`}>before</span>
          <span>or</span>
          <span className={`uppercase`}>after</span>
        </div>
        <DatePicker />
      </div>
      <div className='flex justify-center grow'>
        <button>Cancel</button>
        <button>Set Filter</button>
      </div>
      

      {/* <div className={`flex px-2`}>
        <span className={`text-sm`}>{'Include data before:'}</span>
        <DatePicker />
      </div> */}

      {/* <div className={`flex px-2`}>
        <span className={`text-sm`}>{'Include data after:'}</span>
        <DatePicker />
      </div> */}

    </div>
  )
}

const FilterDialog = () => {
  const [filterType, setFilterType] = useState()

  return (
    <div className={`fixed top-1/2 left-1/2 -translate-x-1/2
      w-11/12 h-40
      text-hermit-grey-400 bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
    `}>
      <div className={`space-x-4 p-2`}>
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
      <div>
        {filterType && filterType === 'date' ? <DateDialog /> : null}
      </div>


    </div>
  )
}

const AddFilter = () => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <FilterDialog />
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
const BlockRefiner = ({ setRefiner }) => {
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [filterConfigs, setFilterConfigs] = useState([])
  const [mobileNavHeight] = useAtom(mobileNavHeightAtom)

  useEffect(() => {
    const direction = sortDirection === 'ascending' ? ascend : descend

    setRefiner(() => sortWith([
      sortBy === 'date'
        ? direction(maybeStart)
        : direction(prop('categoryName')),
      direction(maybeStart),
      direction(prop('categoryName')) 
    ]))
  }, [sortDirection, sortBy, setRefiner])


  return (
    <>
      <div 
        style={{ bottom: `${mobileNavHeight}px` }}
        className='bg-hermit-grey-700 flex flex-col border-t border-hermit-grey-900 fixed w-full'>
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
                   (map(cfg => cfg.filterType === 'date' 
                          ? <DateFilter filterConfig={cfg} key={cfg} /> 
                          : <CategoryFilter filterConfig={cfg} key={cfg} />)
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

  return (
    <section className={`flex flex-col space-y-1`}>
      <BlobCollection blocks={refiner(values(blocks))} />

      <BlockRefiner blocks={values(blocks)} setRefiner={setRefiner} />
    </section>
  )
}

export { History }