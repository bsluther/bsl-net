import { useState } from 'react'


const SimplestResizable = () => {
  const [leftColWidth, setLeftColWidth] = useState(200)
  const [rightColWidth, setRightColWidth] = useState(100)

  const handleMouseDown = lWidth => rWidth => e => {
    const mouseDownX = e.clientX
  
    const handleMouseMove = e => {
      const deltaX = e.clientX - mouseDownX
      console.log('deltaX', deltaX)
      console.log('-lWidth', -lWidth)
      // setLeftColWidth(() => lWidth + deltaX)
      // setLeftColWidth(() => lWidth + Math.max(deltaX, -lWidth))
      setLeftColWidth(() => Math.min(lWidth + Math.max(deltaX, -lWidth), lWidth + rWidth))
      // setRightColWidth(() => rWidth - deltaX)
      // setRightColWidth(() => rWidth - Math.max(deltaX, -lWidth))
      setRightColWidth(() => Math.min(rWidth - Math.max(deltaX, -lWidth)), lWidth + rWidth)
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

export { SimplestResizable }