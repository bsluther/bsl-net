import * as L from 'partial.lenses'
import { atom, useAtom } from 'jotai'
import { useRef } from 'react'
import { Block } from '../block/blockData'
import { add, addIndex, keys, length, map, prop, sort, values } from 'ramda'
import { DateTime } from 'luxon'
import { findIndexById } from '../functions'
import { deleteBlockF } from '../dbRequests'
import { fork } from 'fluture'


const dimensionsAtom = atom({
  containerHeight: undefined,
  containerWidth: undefined,
  cellHeight: '1.5rem'
})

const columnsConfigAtom = atom({
  categoryName: {
    title: 'category',
    position: 1,
    lens: Block.categoryName,
    enabled: true,
    align: 'left'
  },
  date: {
    title: 'date',
    position: 2,
    lens: Block.startDate,
    enabled: true,
    align: 'center'
  },
  start: {
    title: 'start',
    position: 3,
    lens: Block.startTime,
    enabled: true,
    align: 'center'
  },
  end: {
    title: 'end',
    position: 4,
    lens: Block.endTime,
    enabled: true,
    align: 'center'
  },
  duration: {
    title: 'duration',
    position: 5,
    lens: undefined,
    enabled: true,
    align: 'center',
    calculated: true,
    calculation: blc => {
      const startDt = DateTime.fromISO(blc.start.date).set(DateTime.fromISO(blc.start.time).toObject())

      const endDt = DateTime.fromISO(blc.end.date).set(DateTime.fromISO(blc.end.time).toObject())
      const res = endDt.diff(startDt, ['hours', 'minutes']).toObject()

      return `${Math.floor(res.hours)}hr ${Math.floor(res.minutes)}mn`
    }
  }
})

const compareColumns = (c1, c2) => 
  prop('position')(c1) < prop('position')(c2) ? -1 : 1
const sortColumns = sort(compareColumns)

const DeleteButton = ({ invisible, y, handler }) => {
  return (
    <button
      className={`${invisible ? 'invisible' : null} row-start-2`}
      style={{ gridRow: y + 1}}
      onClick={handler}
    > 
      <svg 
        // style={{ gridRow: y}}
        className={`ml-1 w-6 h-6 
          text-hermit-grey-400 hover:text-hermit-yellow-403

        `} 
        fill="currentColor" 
        stroke="rgb(38 38 38)" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
    </button>
  )
}

const LabelCell = ({ title, x, y }) => {
  return (
    <div 
      className={`col-start-${x} row-start-${y} col-span-1 row-span-1
        bg-hermit-grey-900 text-hermit-grey-400 overflow-hidden`}
    >{title}</div>
  )
}

const LabelRow = () => {
  const [columnsConfig] = useAtom(columnsConfigAtom)
  const sortedColumns = sortColumns(values(columnsConfig))
  return (
    <>
      {map(col =>
            <LabelCell title={col.title} x={prop('position')(col)} y={1} key={prop('title')(col)}/>)
          (sortedColumns)}
    </>
  )
}



const Cell = ({ text, x, y, align, handleClick, targeted }) => {
  return (
    <div
      className={`
        col-start-${x} col-span-1 row-start-${y} row-span-1 
        overflow-hidden px-1 cursor-pointer
        ${targeted ? 'bg-hermit-yellow-403' : 'bg-hermit-grey-400'}
        text-${align}
      `}
      onClick={handleClick}
    >
      {text}
    </div>
  )
}


const Row = ({ block, y, editorTarget, setEditorTarget }) => {
  const [columnsConfig] = useAtom(columnsConfigAtom)
  const sortedColConfigs = sortColumns(values(columnsConfig))
  return (
    <>
      {map(col =>
            <Cell
              x={col.position} 
              y={y} 
              text={col.calculated
                ? col.calculation(block)
                : L.get([col.lens])(block)} 
              align={col.align}
              key={`${L.get(Block.id, block)}_col-${col.position}`}
              targeted={editorTarget === block._id}
              handleClick={() => setEditorTarget(L.get(Block.id)(block))}
            />)
          (sortedColConfigs)}

    </>
  )
}

const Grid = ({ blocks, columnsConfig, editorTarget, setEditorTarget }) => {
  const [dimensions] = useAtom(dimensionsAtom)

  const columnCount = length(keys(columnsConfig))
  const rowCount = length(blocks)

  return (
    <div
      style={{
        gridTemplateRows: `repeat(${rowCount}, ${dimensions.cellHeight})`,
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`
      }}
      className={`
        w-full grid gap-x-[1px] gap-y-[1px]
        
      `}
    >
      
      {addIndex(map)((blc, ix) =>
                        <Row block={blc} y={ix + 1} key={L.get(Block.id)(blc)} editorTarget={editorTarget} setEditorTarget={setEditorTarget} />)
                    (blocks)}
    </div>
  )
}

const Matrix = ({ blocks, editorTarget, setEditorTarget, syncBlocks }) => {
  const [dimensions] = useAtom(dimensionsAtom)
  const [columnsConfig] = useAtom(columnsConfigAtom)
  const containerRef = useRef()

  const rowCount = length(blocks)
  const yOfTarget = add(1)(findIndexById(editorTarget)(blocks))

  const handleDelete = () =>
    fork(rej => console.log('Delete failed', rej))
        (() => {
          setEditorTarget('draft')
          syncBlocks()
        })
        (deleteBlockF(editorTarget))


  return (
    <div className='flex h-full'>

      <section 
        className={`w-full h-max bg-hermit-grey-900 border-b border-x border-hermit-grey-900`} 
        ref={containerRef}
      >
        <div
          style={{
            height: dimensions.cellHeight,
            gridTemplateColumns: `repeat(${length(values(columnsConfig))}, 1fr)` 
          }}
          className={`w-full grid gap-x-[1px] gap-y-[1px]
            bg-hermit-grey-400 
            text-center uppercase`}
        >
          <LabelRow />
        </div>
      
        <Grid 
          blocks={blocks} 
          columnsConfig={columnsConfig} 
          editorTarget={editorTarget} 
          setEditorTarget={setEditorTarget}
        />
      </section>

      <div 
        style={{ gridTemplateRows: `repeat(${rowCount + 1}, 1.5rem)` }}
        className='grid h-full w-max gap-y-[1px]'
      >
        <DeleteButton invisible={yOfTarget === 0} y={yOfTarget} handler={handleDelete} />
      </div>
    </div>
  )
}

export { Matrix }