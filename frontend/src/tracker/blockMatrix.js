
import { map, addIndex } from 'ramda'
import { useEffect, useLayoutEffect, useRef, useState, forwardRef } from 'react'
import { useAtom } from 'jotai'
import { getAndStoreCatsAndBlocks, deleteBlock, getAndStoreBlocks } from './fetches'
import { DateTime } from 'luxon'

/* IMPROVEMENTS:
-use Maybes to handle possibly missing or unloaded data
-treat rows as if there was one: then the do the same thing to every row
*/

const isoToF = iso => DateTime.fromISO(iso).toFormat('F')

const isEven = num => (num + 2) % 2 === 0

const mapIx = addIndex(map)

const DeleteButton = forwardRef(({ deleteHandler, id }, ref) =>
  <div className='flex px-1' ref={ref}>
    <button
      className='border border-black text-black bg-white rounded-lg px-2 h-min text-xs self-center'
      onClick={() => {
        deleteHandler(id)
      }}
    >DELETE</button>
  </div>)


const LabelRow = ({ widths }) => {
  return (
    <div className='flex'>
      <div className={`flex border border-black bg-hermit-grey-900 text-hermit-grey-200`}>
        <div className='border-x border-black text-center' style={{ width: widths.category}}>Category</div>
        <div className='border-x border-black text-center' style={{ width: widths.startInstant}}>Start</div>
        <div className='border-x border-black text-center' style={{ width: widths.endInstant}}>End</div>
      </div>
    </div>
  )
}


const Row = ({ data, rowIndex, syncBlocks, widths }) => {
  return (
    <div className='flex bg-hermit-aqua-500'>
      <div className={`flex border border-black ${isEven(rowIndex) ? 'bg-hermit-grey-500' : 'bg-hermit-grey-400'}`}>
        <div style={{ width: widths.category}} className='border-x border-black px-1 w-max'>{data.categoryName}</div>
        <div style={{ width: widths.startInstant}} className='border-x border-black px-1 w-max'>{isoToF(data.startInstant)}</div>
        <div style={{ width: widths.endInstant}} className='border-x border-black px-1 w-max'>{isoToF(data.endInstant)}</div>
      </div>
      <DeleteButton id={data._id} deleteHandler={id => {
        deleteBlock(id)
        syncBlocks()
      }} />
    </div>
  )
}

const BlockMatrix = ({ blocksAtom, categoriesAtom }) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [categories, setCategories] = useAtom(categoriesAtom)
  const containerRef = useRef()
  const [widths, setWidths] = useState({})
  const rightBarRef = useRef()
  // const [rightBarWidth, setRightBarWidth] = useState()


  const syncBlocks = () => getAndStoreBlocks(setBlocks)

  useLayoutEffect(() => {
    const rightBarWidth = rightBarRef.current.clientWidth
    const matrixWidth = containerRef.current.clientWidth - rightBarWidth

    setWidths({
      category: `${Math.floor(.3 * parseInt(matrixWidth))}px`,
      startInstant: `${Math.floor(.35 * parseInt(matrixWidth))}px`,
      endInstant: `${Math.floor(.35 * parseInt(matrixWidth))}px`,
    })
  }, [containerRef])

  useEffect(() => {
    getAndStoreCatsAndBlocks(setCategories)(setBlocks)
  }, [setBlocks, setCategories])

  return (
    <div className='flex flex-col w-full' ref={containerRef}>
      <div className='flex'>
        <LabelRow widths={widths} />
        <div className='invisible'>
          <DeleteButton deleteHandler={x => x} id='formatter' ref={rightBarRef} />
        </div>
      </div>
      {mapIx((block, index) =>
                <Row
                  key={block._id}
                  data={block}
                  syncBlocks={syncBlocks}
                  rowIndex={index}
                  widths={widths}
                />)
            (blocks)}
    </div>
  )
}

export { BlockMatrix }