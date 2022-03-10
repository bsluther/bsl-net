import { assoc, map } from 'ramda'
import * as L from 'partial.lenses'
import { useCallback, useLayoutEffect, useRef, useEffect } from 'react'
import { resizeZeroSum } from './resizeZeroSum'
import { atom, useAtom } from 'jotai'

const colConfigs = [
  {
    id: 'month',
    label: undefined,
    isZeroSum: true
  },
  {
    id: 'week',
    label: undefined,
    isZeroSum: true
  },
  {
    id: 'day',
    label: undefined,
    isZeroSum: true
  },
  {
    id: 'progress',
    label: undefined
  }
]

const initialResizing = {
  columnWidths: {},
  startX: null,
  basisWidths: {},
  order: []
}

const resizingAtom = atom(initialResizing)

const calcOrder = map(config => config.id)

/*********************************************/

const Resizer = ({ resizeHandler, id, setResizing, isZeroSum, resizerWidth = 6 }) => {
  return (
    <span
      style={{
        width: `${resizerWidth}px`,
        right: `-${(resizerWidth / 2) + 1}px`
      }} 
      className={`absolute top-0 h-full hover:bg-hermit-yellow-403 cursor-col-resize`}
      onMouseDown={e => {
        resizeHandler(id)(e)
        if (isZeroSum) {
          resizeZeroSum(setResizing)(id)(e)
        }
      }}
      role='separator'
      // onMouseDown={resizeHandler(id)}
    />
  )
}

/*********************************************/

const Cell = ({ defaultWidth = 'maxWidth', resizedWidth, resizeHandler, setBasisWidth, id, setResizing, isZeroSum }) => {
  const cellRef = useRef()

  useLayoutEffect(() => {
    setBasisWidth(id)(cellRef.current.offsetWidth)
  }, [setBasisWidth, id, cellRef])

  return (
    <th
      scope='col'
      ref={cellRef}
      style={{ width: resizedWidth ?? defaultWidth }}
      className={`relative bg-hermit-grey-900 text-hermit-grey-400 border-hermit-grey-400 h-6 px-2 font-bold uppercase`}
    >
      {id}
      <Resizer resizeHandler={resizeHandler} id={id} setResizing={setResizing} isZeroSum={isZeroSum} />
    </th>
  )
}

/*********************************************/

const Header = ({ columnConfigs = colConfigs, maxWidth = 600 }) => {
  const [resizing, setResizing] = useAtom(resizingAtom)

  useEffect(() => {
    setResizing(prev => assoc('order')
                             (calcOrder(columnConfigs))
                             (prev))
  }, [setResizing, columnConfigs])


  const setBasisWidth = useCallback(
    id => w =>
      setResizing(prev => L.set(['basisWidths', id])
                             (w)
                             (prev))
  , [setResizing])


  const resizeHandler = useCallback(
    id => e => {
      const startX = e.clientX
      setResizing(prev => ({ 
        ...prev, 
        startX, 
        isResizing: id
      }))

      const handleMouseMove = e => {
        setResizing(prev => {
          const deltaX = e.clientX - prev.startX
          const basisWidth = prev.basisWidths[id]
          const percentageDeltaX = Math.max(deltaX / basisWidth, -0.999999)
          const newWidth = Math.max(basisWidth + basisWidth * percentageDeltaX, 0)
          return {
            ...prev,
            startX,
            columnWidths: {
              ...prev.columnWidths,
              [id]: newWidth
            }
          }
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousemove', handleMouseMove)

        setResizing(prev => ({
          ...prev,
          startX: null,
          isResizing: null,
          basisWidths: {
            ...prev.basisWidths,
            [id]: prev.columnWidths[id]
          }
        }))
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
  }, [setResizing])





  return (
    <thead
      className={`flex`}
    >
      <tr>
      {
        map(config =>
              <Cell 
                resizedWidth={resizing.columnWidths[config.id]} 
                resizeHandler={resizeHandler}
                setBasisWidth={setBasisWidth}
                id={config.id}
                key={config.id}
                setResizing={setResizing}
                isZeroSum={config.isZeroSum}
                defaultWidth={config.defaultWidth}
              />)
           (columnConfigs)
      }
      </tr>
    </thead>
  )
}

export { Header as ResizableHeaderTable, resizingAtom }