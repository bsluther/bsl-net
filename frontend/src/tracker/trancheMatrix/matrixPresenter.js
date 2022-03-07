import { atom, useAtom } from 'jotai'
import { map, addIndex } from 'ramda'
import { toPairs } from 'ramda'
import { reduce } from 'ramda'
import { useMemo } from 'react'
import { ResizableHeader, resizingAtom } from '../../resizable/resizableHeader'
const mapIx = addIndex(map)
/*
TODO:
-make cells and rows higher order components?
*/

const basisWidthsAtom = atom(
  get => get(resizingAtom).basisWidths
)

const columnWidthsAtom = atom(
  get => get(resizingAtom).columnWidths
)

const orderAtom = atom(
  get => get(resizingAtom).order
)

/************************************************************/

const colConfigs = [
  {
    id: 'category',
    defaultWidth: '20rem'
  },
  {
    id: 'this_month'
  },
  {
    id: 'last_week'
  },
  {
    id: 'this_week'
  },
  {
    id: 'total'
  }
]

/************************************************************/

const getCascadingWidth = id => colWidths => basisWidths =>
  colWidths[id] ?? basisWidths[id] ?? 0

const calcWidths = colConfigs => colWidths => basisWidths =>
  reduce((acc, x) => Object.assign(acc, x))
        ({})
        (map(config => ({ [config.id]: getCascadingWidth(config.id)(colWidths)(basisWidths) }))
            (colConfigs))



const Cell = ({ width, content, colId }) => {
  return (
    <div
      style={{ width: `${width}px` }}
      className={`
        h-6 px-1 overflow-hidden
        border-b border-r border-black
        ${colId ==='category' ? 'text-left' : 'text-center'}
      `}
    >
      {content}
    </div>
  )
}

/************************************************************/

const Row = ({ widths, order, tranche }) => {
  return (
    <div
      className={`flex bg-hermit-grey-400`}
    >
    {
      map(colId =>
           <Cell 
             width={widths[colId]}
             content={tranche.columnData[colId]}
             key={colId}
             colId={colId}
           />)
         (order)
    }
    </div>
  )
}


/************************************************************/

const Body = ({ matrixData, widths, order }) => {
  return (
    <div
      className={`flex flex-col border-l border-hermit-grey-900`}
    >
      {
        map(trn => 
             <Row 
              widths={widths}
              order={order}
              tranche={trn}
              key={trn.categoryId}
             />)
           (matrixData)
      }
    </div>
  )
}


/************************************************************/


const MatrixPresenter = ({ columnConfigs = colConfigs, matrixData }) => {
  const [basisWidths] = useAtom(basisWidthsAtom)
  const [columnWidths] = useAtom(columnWidthsAtom)
  const [order] = useAtom(orderAtom)

  const widths = useMemo(
    () => calcWidths(columnConfigs)(columnWidths)(basisWidths)
  , [columnConfigs, columnWidths, basisWidths])

  return (
    <section className={``}>
      <ResizableHeader columnConfigs={columnConfigs} />
      <Body 
        matrixData={matrixData}
        widths={widths}
        order={order}
      />  
    </section>
  )
}

export { MatrixPresenter }