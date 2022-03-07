import { useState } from 'react'


const SimpleResizable = () => {
  const [leftColWidth, setLeftColWidth] = useState(200)
  const [rightColWidth, setRightColWidth] = useState(200)
  const [resizing, setResizing] = useState({ prevX: null })

  const handleMouseDown = lWidth => rWidth => e => {
    const mouseDownX = e.clientX
  
    const handleMouseMove = e => {
      const deltaX = e.clientX - mouseDownX
      // const leftPercentageDeltaX = deltaX / lWidth
      const leftPercentageDeltaX = Math.max(deltaX / lWidth, -0.999999)
      // const rightPercentageDeltaX = deltaX / rWidth
      const rightPercentageDeltaX = Math.max(deltaX / rWidth, -0.999999)
      setLeftColWidth(() => Math.max(lWidth + lWidth * leftPercentageDeltaX, 0))
      setRightColWidth(() => Math.max(rWidth - rWidth * rightPercentageDeltaX, 0))
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
        onMouseDown={handleMouseDown(leftColWidth)(rightColWidth)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-1 bg-yellow-400 cursor-col-resize`}
        />
      </div>
      <div
        style={{ width: `${rightColWidth}px` }}
        className={`border border-black h-6 w-20`}
      />
    </div>
  )
}

export { SimpleResizable }