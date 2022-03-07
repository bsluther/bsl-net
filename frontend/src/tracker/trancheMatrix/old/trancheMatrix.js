import { atom } from 'jotai'
import { map, addIndex, prepend, unnest } from 'ramda'
import { useState } from 'react'
const mapIx = addIndex(map)


/************** HELPER FUNCTIONS  **************/

const arrayToN_ = arr => n =>
  n === 0
    ? arr
    : arrayToN_(prepend(n - 1)(arr))
               (n - 1)
const arrayToN = arrayToN_([])

const createIndexMatrix = w => h => {
	const nByN = map(() => arrayToN(w))
		 							 (Array(h))

  const nestedCoords = mapIx((arr, ix) => map(x => [x, ix])(arr))
  								 	        (nByN)

  const flattenedCoords = unnest(nestedCoords)

  return flattenedCoords
}

/*** LAWS ***
Matrix coords are zero-based. Conversion to grid coordinates is handled during presentation.

Top-left is (0, 0).

All presentation sizing is in rem.
************/

const containerWidth = 50
const containerHeight = 20

const gridWidth = 50
const gridHeight = 50

const cellHeight = 1.3
const cellWidth = 6

const colCount = 5
const rowCount = 15


const columnsAtom = atom({
  resizedWidth: null
})


const tupleToObject = ([x, y]) => ({ x, y })
const cellCoords = map(tupleToObject)(createIndexMatrix(colCount)(rowCount))







const BgCell = ({x, y}) => 
  <div 
    style={{ 
      width: `${cellWidth}rem`, 
      height: `${cellHeight}rem`,
      gridColumn: `${x + 1} / ${x + 2}`,
      gridRow: `${y + 1} / ${y + 2}`
    }}
    className={`bg-hermit-grey-400`} />

const Cell = ({ x, y, text }) => 
    <span 
      style={{ 
        width: `${cellWidth}rem`, 
        height: `${cellHeight}rem`,
        gridColumn: `${x + 1} / ${x + 2}`,
        gridRow: `${y + 1} / ${y + 2}`
      }}
    >{text}</span>

const ColLabelBackground = () => {
  return (
    <div
      style={{
        gridColumn: `1 / ${colCount + 1}`,
        gridRow: '1'
      }}
      className='bg-hermit-grey-400'
    />
  )
}

const ColLabelCell = ({ x, text }) => {
  return (
    <div 
      style={{ 
        width: `${cellWidth}rem`, 
        height: `${cellHeight}rem`,
        gridColumn: `${x + 1} / ${x + 2}`,
        gridRow: `1 / 1`
      }}
      className={`bg-hermit-grey-900 z-10`} />
  )
}

const ResizeBar = () => {
  return (
    <div
      style={{ 
        width: '1px',
        height: `${cellHeight}rem`,
        gridColumn: '2 / 3',
        gridRow: '1'
      }}
      className='z-50 -ml-[1px] bg-orange-400 cursor-col-resize'
    />
  )
}


const Grid = ({ children }) => {
  return (
    <div
      style={{ 
        width: `${gridWidth}rem`, 
        height: `${gridHeight}rem`,
        gridTemplateColumns: `repeat(${colCount}, ${cellWidth}rem)`,
        gridTemplateRows: `repeat(${rowCount}, ${cellHeight}rem)`
      }}
      className={`
        w-full h-full
        grid grid-cols-${colCount} grid-rows-${rowCount} gap-[1px]
      `}
    >
      {children}
    </div>
  )
}

const LabelRow = ({ labels }) =>
  <div className='flex'>
    {map(lbl => 
          <>
            <LabelCell key={lbl} text={lbl} />
            <LabelBar />
          </>)
        (labels)}
  </div>

const LabelBar = () => 
  <div 
    style={{ width: '1px', height: `${cellHeight}rem`}}
    className='bg-green-400 cursor-col-resize'
  />

const LabelCell = ({ text }) =>
  <div 
    style={{ width: `${cellWidth}rem`, height: `${cellHeight}rem`}}
    className='bg-yellow-400 overflow-hidden'
  >
    {text}
  </div>

const Presenter = () => {
  return (
    <section
      style={{ width: `${containerWidth}rem`, height: `${containerHeight}rem`}}
      className={`bg-hermit-grey-900 overflow-scroll z-0`}
    >
      <LabelRow labels={['month', 'week', 'target']}/>
      <Grid>
        <ColLabelBackground />
        <ResizeBar />
        {map(x => <ColLabelCell key={x} x={x} />)
            (arrayToN(colCount))}
        {map(({ x, y }) => <BgCell key={`${x},${y}`} x={x} y={y} />)
            (cellCoords)}
        <Cell x={3} y={8} text='test' />
      </Grid>
    </section>
  )
}

const TrancheMatrix = () => {
  const [colCount, setColCount] = useState(5)


  return (
    <Presenter />
  )
}

export { TrancheMatrix }