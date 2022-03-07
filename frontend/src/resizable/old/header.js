import { assoc, map, pipe, addIndex, update } from 'ramda'
import { useLayoutEffect, useState, useRef, useCallback } from 'react'
import * as L from 'partial.lenses'
const mapIx = addIndex(map)

const testColConfig = [
  {
    label: 'Month',
    defaultWidth: '14rem',
    hasResized: false,
    width: null,
    prevX: null
  },
  {
    label: 'Week',
    defaultWidth: '12rem',
    hasResized: false,
    width: null,
    prevX: null
  },
  {
    label: 'day',
    defaultWidth: '16rem',
    hasResized: false,
    width: null,
    prevX: null
  }
]

// prop above "prevX" should probably be called "prevResizerX"







  const Resizer = ({ pxWidth = 5, handleResize }) => {

    const handleMouseDown = e => {
  
      const startX = e.clientX
  
      const handleMouseMove = e => {
        handleResize(startX)(e)
      }
  
      const handleMouseUp = e => {
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousemove', handleMouseMove)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  
    return (
      <span
        style={{ 
          width: `${pxWidth}px`,
          right: `-${pxWidth / 2}px` 
        }}
        className={`absolute top-0 h-full 
          hover:bg-hermit-yellow-403 cursor-col-resize
        `}
        onMouseDown={handleMouseDown} 
      />
    )
  }



const Cell = ({ label, defaultWidth, hasResized, width, prevX, handleResize, setWidth, resizerIndex }) => {
  const cellRef = useRef()

  useLayoutEffect(() => {
    setWidth(cellRef.current.clientWidth, resizerIndex - 1)
  }, [setWidth, cellRef])

  return (
    <div
      style={{
        width: hasResized ? `${width}px` : defaultWidth
      }}
      ref={cellRef}
      className={`relative h-6 justify-self-start bg-hermit-grey-400 border border-hermit-grey-900`}
    >
      <Resizer 
        handleResize={handleResize}
        // setResizingWidth={w => setResizing(prev => ({ ...prev, width: w }))}
        // resizing={resizing}
        // setResizing={setResizing}
      />
    </div>
  )
}

const Header = ({ colConfig = testColConfig }) => {
  const [colState, setColState] = useState(colConfig)
  const colCount = colState.length

  const setWidth = useCallback(
    (w, idx) => setColState(prev => {
      const res = L.set([idx, 'width'], w, prev)
      return res
    })
  , [setColState])

  const handleResize = resizerIndex => startX => e => {
    if (resizerIndex === 0 || resizerIndex === colCount) {
      return null
    }

    setColState(prev => {
      const prevLeftSide = prev[resizerIndex - 1]
      const deltaX = e.clientX - (prevLeftSide.prevX ?? startX)
      const percentageDeltaX = Math.max(
        deltaX / prevLeftSide.width,
        -0.999999
      )

      const newLeftSide = {
        ...prevLeftSide,
        hasResized: true,
        prevX: e.clientX,
        width: prevLeftSide.width + prevLeftSide.width * percentageDeltaX
      }

      const prevRightSide = prev[resizerIndex]

      const newRightSide = {
        ...prevRightSide,
        hasResized: true,
        width: prevRightSide.width - prevRightSide.width * percentageDeltaX
      }

      const colsWithUpdatedLeft = update(resizerIndex - 1)(newLeftSide)(prev)
      const colsWithUpdates = update(resizerIndex)(newRightSide)(colsWithUpdatedLeft)
      return colsWithUpdates
    })
  }

  return (
    <div className='w-full flex'>
      {mapIx((config, idx) => 
                <Cell 
                  {...config} 
                  resizerIndex={idx + 1} 
                  handleResize={handleResize(idx + 1)} 
                  key={config.label} 
                  setWidth={setWidth}/>)
            (colState)}
    </div>
  )
}

export { Header as ResizableHeader }