import { atom } from 'jotai'
import { map } from 'ramda'
import { BlockCreator } from './blockCreator'
import { BlockMatrix } from './blockMatrix'
import { assocName } from './fetches'

const categoriesAtom = atom([])
const blocksAtom = atom([])
const namedBlocksAtom = atom(
  get => map(assocName(get(categoriesAtom)))
            (get(blocksAtom)),
  (get, set, blks) => set(blocksAtom, blks)
)

const Tracker = () => {
  return (
    <section className={`w-screen grid grid-cols-2`}>
      <div className='w-full'>
        <BlockCreator categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div>

      <div className='w-full'>
        <BlockMatrix categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div>
    </section>
  )
}

export { Tracker }