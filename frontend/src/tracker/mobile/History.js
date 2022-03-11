import { useAtom } from 'jotai'
import { namedBlocks2Atom, categoriesAtom } from '../atoms'
import { blockEnd, blockStart, maybeStart } from '../block/blockData'
import { maybe, I } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'
import { useEffect, useState } from 'react'
import { ChevronDoubleDownSvg, PlusSvg, SwitchVerticalSvg } from '../svg'
import { ascend, descend, prop, sortWith, map, values, append } from 'ramda'








const BlockBlob = ({ block }) => {
  const start = blockStart(block)
  const end = blockEnd(block)

  return (
    <div className={`border border-hermit-grey-900 space-x-6 w-max rounded-md px-2 bg-hermit-grey-400`}>
      
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      {/* <span>{`${maybe('')(toFormat('h:mm'))(start)}-${maybe('')(toFormat('h:mm'))(end)}`}</span> */}
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

const BlobCollection = ({ blocks }) => {
  return (
    <div className={`flex flex-col items-center justify-center px-1 space-y-1 overflow-scroll`}>
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

const AddFilter = () => {
  const [editing, setEditing] = useState(false)
  const [editingType, setEditingType] = useState()

  if (editing) {
    return (
      <div className='absolute text-hermit-grey-400 bg-hermit-grey-900 space-x-4 top-8 left-0'>
        <span>date</span>
        <span>category</span>
      </div>
      // <div className='absolute top-10 right-0 w-52 h-16
      // bg-yellow-400 border border-hermit-grey-900 rounded-md'>
      //   <span>date</span>
      //   <span>category</span>
      // </div>
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
const BlockFilter = ({ blocks }) => {
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('ascending')
  const [filterConfigs, setFilterConfigs] = useState([])
  const direction = sortDirection === 'ascending' ? ascend : descend

  const directionHash = {
    ascending: ascend,
    descending: descend
  }

  const sortedBlocks = sortWith([
    sortBy === 'date'
      ? direction(maybeStart)
      : direction(prop('categoryName')),
    direction(maybeStart),
    direction(prop('categoryName')) 
  ])(blocks)

  return (
    <>
      <div className=' bg-hermit-grey-700 flex flex-col border-b border-hermit-grey-900'>
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

      {/* <BlobCollection blocks={sortedBlocks} /> */}
    </>
  )
}

const History = () => {
  const [blocks, setBlocks] = useAtom(namedBlocks2Atom)
  const [categories, setCategories] = useAtom(categoriesAtom)

  return (
    <section className={`h-full overflow-scroll flex flex-col space-y-1`}>
      <BlockFilter blocks={values(blocks)} />
      
    </section>
  )
}

export { History }