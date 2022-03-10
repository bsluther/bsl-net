import { atom, useAtom } from 'jotai'
import { map } from 'ramda'
import { reduce as fold } from 'sanctuary'
import { useMemo } from 'react'
import { ResizableHeaderTable, resizingAtom } from '../../resizable/resizableHeaderTable'
import { values, reduce } from 'ramda'
import { add } from 'ramda'

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
    <td
      style={{ width: `${width}px` }}
      className={`
        h-max px-1 overflow-hidden
        border border-hermit-grey-900
        ${colId ==='category' ? 'text-left' : 'text-center'}
      `}
    >
      {content}
    </td>
  )
}

/************************************************************/

const Row = ({ widths, order, tranche }) => {
  return (
    <tr
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
    </tr>
  )
}


/************************************************************/

const Body = ({ matrixData, widths, order }) => {
  const totalWidth = useMemo(() => 
    fold(add)
        (0)
        (values(widths))
  , [widths])

  return (
    <tbody
      style={{ width: totalWidth }}
      className={`flex flex-col border border-hermit-grey-900`}
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
    </tbody>
  )
}


/************************************************************/


const MatrixPresenterTable = ({ columnConfigs = colConfigs, matrixData }) => {
  const [basisWidths] = useAtom(basisWidthsAtom)
  const [columnWidths] = useAtom(columnWidthsAtom)
  const [order] = useAtom(orderAtom)

  const widths = useMemo(
    () => calcWidths(columnConfigs)(columnWidths)(basisWidths)
  , [columnConfigs, columnWidths, basisWidths])

  return (
    <table className={`bg-hermit-aqua-500`}>
      <ResizableHeaderTable columnConfigs={columnConfigs} />
      <Body 
        matrixData={matrixData}
        widths={widths}
        order={order}
      />  
    </table>
  )
}

export { MatrixPresenterTable }