import { useState } from 'react'

const calcPercentageDeltaX = deltaX => width =>
  Math.max(
    deltaX / width,
    -0.999999
  )


const calcLeftResize = origWidth => deltaX => 
  Math.round(origWidth + origWidth * calcPercentageDeltaX(deltaX)(origWidth))


const calcRightResize = origWidth => deltaX => 
  Math.round(origWidth - origWidth * calcPercentageDeltaX(deltaX)(origWidth))


// const resizePair = startX => deltaX => leftSetter => leftW

const ResizeTwo = () => {
  const [leftColWidth, setLeftColWidth] = useState(200)
  // const [leftColWidth, setLeftColWidth] = useState({ width: 200, startX: null})
  const [rightColWidth, setRightColWidth] = useState(200)
  // const [rightColWidth, setRightColWidth] = useState({ width: 200, startX: null })
  // const [resizing, setResizing] = useState({ 
  //   startX: null 
  // })


  const handleMouseDown = lWidth => rWidth => e => {
    const startX = e.clientX
  
    const handleMouseMove = e => {
      const deltaX = e.clientX - startX

      const leftResize = calcLeftResize(leftColWidth)(deltaX)
      const rightResize = calcRightResize(rightColWidth)(deltaX)
      console.log(leftResize, rightResize)

      setLeftColWidth(leftResize)
      setRightColWidth(rightResize)
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className={`flex`}>
      <div
        style={{ width: `${leftColWidth}px`}} 
        className={`relative border border-black h-6`} 
      >
        <div
          className={`absolute right-0 top-0 h-full w-1 bg-yellow-400 cursor-col-resize`}
          onMouseDown={handleMouseDown(leftColWidth)(rightColWidth)}
        />
      </div>
      <div
        style={{ width: `${rightColWidth}px` }}
        className={`border border-black h-6 w-20`}
      />
    </div>
  )
}

export { ResizeTwo }