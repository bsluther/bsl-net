import * as L from 'partial.lenses'
import { atom, useAtom } from 'jotai'
import { useLayoutEffect, useRef } from 'react'
import { Block } from '../blockData'
import { addIndex, keys, length, map, prop, sort, values } from 'ramda'
import { DateTime } from 'luxon'

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
      return `${res.hours}hr ${res.minutes}mn`
    }
  }
})

const compareColumns = (c1, c2) => prop('position')(c1) < prop('position')(c2) ? -1 : 1
const sortColumns = sort(compareColumns)

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
        ${targeted ? 'bg-hermit-yellow-400' : 'bg-hermit-grey-400'}
        overflow-hidden px-1
        text-${align}`}
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
  const [dimensions, setDimensions] = useAtom(dimensionsAtom)

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

const Matrix = ({ blocks, editorTarget, setEditorTarget }) => {
  const [dimensions, setDimensions] = useAtom(dimensionsAtom)
  const [columnsConfig] = useAtom(columnsConfigAtom)
  const containerRef = useRef()

  const compDur = L.collect([L.children])

  // useLayoutEffect(() => {
  //   setDimensions(L.set(['containerHeight'])(containerRef.current.clientHeight))
  //   setDimensions(L.set(['containerWidth'])(containerRef.current.clientWidth))
  // }, [containerRef, setDimensions])

  return (
    <section className={`w-full h-max bg-hermit-grey-900 border-b border-x border-hermit-grey-900`} ref={containerRef}>
      <div
        style={{ height: dimensions.cellHeight, gridTemplateColumns: `repeat(${length(values(columnsConfig))}, 1fr)` }}
        className={`w-full grid gap-x-[1px] gap-y-[1px]
          bg-hermit-grey-400 
          text-center uppercase`}
      >
        <LabelRow />
      </div>

      <Grid blocks={blocks} columnsConfig={columnsConfig} editorTarget={editorTarget} setEditorTarget={setEditorTarget} />
    </section>
  )
}

export { Matrix }