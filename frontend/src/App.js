// import { useEffect, useState } from 'react'
import { BlockCreator } from './tracker/blockCreator'
import { BlockMatrix } from './tracker/blockMatrix'
import { atom, useAtom } from 'jotai'
import { assocName } from './tracker/fetches'
import { map } from 'ramda'


const categoriesAtom = atom([])
const blocksAtom = atom([])
const namedBlocksAtom = atom(
  get => map(assocName(get(categoriesAtom)))
            (get(blocksAtom)),
  (get, set, blks) => set(blocksAtom, blks)
)

const Header = () => {
  return (
    <section className={`
      flex row-start-1 row-end-2 col-start-1 col-end-3 w-full justify-center
      border-black bg-blue-900`}>
      <div className=''>BSL</div>
    </section>
  )
}

const App = () => {
  const [namedBlocks, setNamedBlocks] = useAtom(namedBlocksAtom)
  console.log(namedBlocks)
  return (
    <section className='grid grid-rows-container grid-cols-2 font-customMono'>
      <Header />
      <div className='row-start-2'>
        <BlockCreator categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div>

      <div className='row-start-2 col-start-2 bg-gray-400'>
        <BlockMatrix categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div>
      
    </section>
  )
}

export default App