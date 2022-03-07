import { map } from 'ramda'
import { useLayoutEffect, useState, useRef } from 'react'
import * as L from 'partial.lenses'


const Resizer = ({ handleXChange = x => x }) => {
  const [resizing, setResizing] = useState(false)
  const [start, setStart] = useState()

  console.log('resizing: ', resizing)
  console.log('start: ', start)

  return (
    <div 
      draggable
      className={`absolute top-0 right-0 w-1 h-full bg-orange-400 cursor-col-resize`}
      // onMouseDown={e => {
      //   console.log(e.target.firstParent)
      //   setResizing(true)
      //   setStart(e.clientX)
      // }}
      // onMouseUp={e => setResizing(false)}
      onDragStart={e => setStart(e.clientX)}
      onDrag={e => {
        console.log(e.clientX - start)
        handleXChange(e.clientX - start)
      }}
    />
  )
}

const HeaderCell = ({ label, width, handleXChange, setColWidths }) => {
  const cellRef = useRef()
  useLayoutEffect(() => {
    setColWidths(obj => 
      L.set([label])
           (cellRef.current.clientWidth)
           (obj)
    )
  }, [label, cellRef])

  return (
    <div
      style={{ width: width ? width : undefined }}
      className={`relative bg-hermit-grey-400 px-2`}
      ref={cellRef}
    >
      {label}
      <Resizer handleXChange={handleXChange} />
    </div>
  )
}

const HeaderRow = ({ labels, colWidths, setColWidths }) => {

  return (
    <div className={`flex`}>
      {map(lbl => 
            <HeaderCell 
              key={lbl} 
              label={lbl} 
              width={colWidths[lbl]} 
              handleXChange= {dx => setColWidths(L.modify([lbl], prev => prev + dx,colWidths))}
              setColWidths={setColWidths}
            />)
          (labels)}
    </div>
  )
}

const TrancheMatrix = () => {
  const [colWidths, setColWidths] = useState({})
  console.log(colWidths)
  return (
    <section>
      <HeaderRow
        colWidths={colWidths}
        setColWidths={setColWidths}
        labels={['month', 'week', 'day', 'progress']}
      />
    </section>
  )
}

export { TrancheMatrix }