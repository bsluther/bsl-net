import { useLayoutEffect, useState, useRef } from 'react'


const Resizer = ({ pxWidth = 5, setResizing }) => {

  const handleMouseDown = e => {

    const startX = e.clientX

    const handleMouseMove = e => {
      // console.log('parent node clientWidth', e.target.parentNode.clientWidth)

      setResizing(prev => {
        const deltaX = e.clientX - (prev.prevX ?? startX)
        // console.log('deltaX', deltaX)
        const percentageDeltaX = deltaX / prev.width
        console.log(percentageDeltaX)
        const newWidth = prev.width + prev.width * percentageDeltaX
        const maxWidth = 400


        const res = { 
          width: newWidth > maxWidth ? prev.width : newWidth, 
          hasResized: true,
          prevX: newWidth > maxWidth ? prev.prevX : e.clientX
        }
        return res
      })
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

const Resizable = ({ defaultWidth = '18rem' }) => {
  const [resizing, setResizing] = useState({ hasResized: false, width: null })
  const headerRef = useRef()
  console.log('resizing.width', resizing.width)
  useLayoutEffect(() => {
    setResizing({ 
      hasResized: false, 
      width: headerRef.current.clientWidth 
    })
  }, [headerRef, setResizing])

  return (
    <div
      style={{
        width: resizing.hasResized ? `${resizing.width}px` : defaultWidth
      }}
      className={`relative h-6 justify-self-start bg-hermit-grey-400 border border-hermit-grey-900`}
      ref={headerRef}
    >
      <Resizer 
        setResizingWidth={w => setResizing(prev => ({ ...prev, width: w }))}
        resizing={resizing}
        setResizing={setResizing}
      />
    </div>
  )
}

export { Resizable }