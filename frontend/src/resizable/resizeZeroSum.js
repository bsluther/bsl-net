import { findIndex } from 'ramda'


const getRightNeighbor = id => order => {
  const subjectIdx = findIndex(x => x === id)(order)
  const nextIdx = order[subjectIdx + 1]
  return nextIdx
}

const resizeZeroSum = setter => id => e => {
  const startX = e.clientX
  setter(prev => ({ 
    ...prev, 
    startX, 
    isResizing: id,
    isReacting: getRightNeighbor(id)(prev.order)
  }))

  const handleMouseMove = e => {
    setter(prev => {
      const reacting = prev.isReacting
      const deltaX = prev.startX - e.clientX
      const basisWidth = prev.basisWidths[reacting]
      const percentageDeltaX = Math.max(deltaX / basisWidth, -0.999999)
      const newWidth = Math.max(basisWidth + basisWidth * percentageDeltaX, 0)

      return {
        ...prev,
        columnWidths: {
          ...prev.columnWidths,
          [reacting]: newWidth
        }
      }
    })
  }

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)

    setter(prev => ({
      ...prev,
      startX: null,
      isResizing: null,
      isReacting: null,
      basisWidths: {
        ...prev.basisWidths,
        [prev.isReacting]: prev.columnWidths[prev.isReacting]
      }
    }))
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

export { resizeZeroSum }