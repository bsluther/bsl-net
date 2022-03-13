import { useAtom } from 'jotai'
import { namedBlocks2Atom } from '../atoms'
import { blockStart, maybeStart } from '../block/blockData'
import { maybe, I, pipe } from 'sanctuary'
import { useEffect, useState } from 'react'
import { ChevronDoubleDownSvg, PlusSvg } from '../svg'
import { ascend, descend, prop, sortWith, map, values, append, gte, lte, filter, addIndex } from 'ramda'
import { DateTime } from 'luxon'
import { BlockBlob } from './BlockBlob'
import { filterConfigsAtom } from '../state/filterAtoms'
import { Filterer } from '../filtering/FilterDialog'
const mapIx = addIndex(map)




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



const AddFilter = () => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <Filterer endEditing={() => setEditing(false)} />
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


const predicateHash = {
    gte: param => pipe([
      blockStart,
      maybe(false)(lte(DateTime.fromISO(param)))
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
  const [blocks] = useAtom(namedBlocks2Atom)

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
    <div 
      className='bg-hermit-grey-700 flex flex-col border-b border-hermit-grey-900  w-full h-full'>
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
  )
}

const History = () => { 
  const [blocks] = useAtom(namedBlocks2Atom)
  const [refiner, setRefiner] = useState(() => I)
  return (
    <section className='flex flex-col basis-full w-full h-full space-y-2'>
      <BlockRefiner blocks={values(blocks)} setRefiner={setRefiner} />
      <BlobCollection blocks={refiner(values(blocks))} />
    </section>
          

  )
}

export { History }