import { atom, useAtom } from 'jotai'
import { filter, length, map, prop, values, toPairs, reduce } from 'ramda'
import { useMemo } from 'react'
import { ResizableHeader, resizingAtom } from '../../resizable/resizableHeader'
import { filterByCategory, blocksToTranches } from '../tranche/functions'
import * as L from 'partial.lenses'
import { DateTime, Duration } from 'luxon'
import { emptyDuration, objAgo, gt } from '../dateTime/functions'
import { blockDuration, blockInRange, blockStart, blockStartedAfter } from '../block/blockData'
import { isDuration, luxonPlus, toFormat } from '../dateTime/pointfree'
import { justs, pipe, concat, reduce as fold } from 'sanctuary'

/* TO-DO
-Separate calculation of values into a logic component to avoid recalculating on every resize
*/


const log = (x, comment) => {
  console.log(`${comment}: `, x)
  return x
}

const sumCalc = pipe([
  map(blockDuration),
  justs,
  filter(isDuration),
  fold(luxonPlus)(emptyDuration())
])

const colConfigs = [
  {
    id: 'category',
    calculation: prop('categoryName')
  },
  {
    id: 'this month',
    calculation: pipe([
      prop('blocks'),
      filter(blc => !blc.isDraft),
      filter(blockStartedAfter(objAgo({ months: 1 }))),
      sumCalc,
      toFormat('hh:mm')
    ])
  },
  {
    id: 'last week',
    calculation: pipe([
      prop('blocks'),
      filter(blc => !blc.isDraft),
      filter(blockInRange(objAgo({ weeks: 2 }))
                         (objAgo({ weeks: 1 }))),
      sumCalc,
      toFormat('hh:mm')
    ])
  },
  {
    id: 'this week',
    calculation: pipe([
      prop('blocks'),
      filter(blc => !blc.isDraft),
      filter(blockStartedAfter(objAgo({ weeks: 1 }))),
      sumCalc,
      toFormat('hh:mm')
    ])
  },
  {
    id: 'total',
    calculation: pipe([
      prop('blocks'),
      filter(blc => !blc.isDraft),
      sumCalc,
      toFormat('hh:mm')
    ])
  }
]

const colCalculations = {
  category: prop('categoryName'),
  this_month: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockStartedAfter(objAgo({ months: 1 }))),
    sumCalc,
    toFormat('hh:mm')
  ]),
  last_week: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockInRange(objAgo({ weeks: 2 }))
                       (objAgo({ weeks: 1 }))),
    sumCalc,
    toFormat('hh:mm')
  ]),
  this_week: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockStartedAfter(objAgo({ weeks: 1 }))),
    sumCalc,
    toFormat('hh:mm')
  ]),
  total: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    sumCalc,
    toFormat('hh:mm')
  ])
}



const basisWidthsAtom = atom(
  get => get(resizingAtom).basisWidths
)

const columnWidthsAtom = atom(
  get => get(resizingAtom).columnWidths
)

const orderAtom = atom(
  get => get(resizingAtom).order
)

const getWidth = id => colWidths => basisWidths =>
  colWidths[id] ?? basisWidths[id] ?? 0

const calcWidths = colConfigs => colWidths => basisWidths =>
  reduce((acc, x) => Object.assign(acc, x))
        ({})
        (map(config => ({ [config.id]: getWidth(config.id)(colWidths)(basisWidths) }))
            (colConfigs))

const assign = target => src => Object.assign({}, target, src)
const keyById = obj => ({ [obj.id]: obj })
const foldToIdObj = reduce((acc, x) => assign(acc)(keyById(x)))
                          ({})

/************************************************************/

const Cell = ({ width, content, calculation, tranche }) => {
  const memoizedContent = useMemo(
    () => calculation(tranche)
  , [tranche])

  return (
    <div
      style={{ width: `${width}px` }}
      className={`border-b border-r border-black h-6 overflow-hidden`}
    >
      {memoizedContent}
    </div>
  )
}

/************************************************************/

const Row = ({ widths, order, columnConfigs, tranche }) => {
  const colConfigHash = useMemo(() => foldToIdObj(columnConfigs), [columnConfigs])
  // console.log('colConfigHash', colConfigHash)
  return (
    <div className={`flex`}>
      {map(id => 
            <Cell 
              width={widths[id]} 
              key={id} 
              content={colConfigHash[id].calculation(tranche)}
              calculation={colConfigHash[id].calculation}
              tranche={tranche}
            />)
          (order)}
    </div>
  )
}

/************************************************************/


const Body = ({ columnConfigs, tranches, widths, rowCount, order }) => {

  return (
    <div
      className={`flex flex-col border-l border-hermit-grey-900`}
    >
      {map(tranche => 
            <Row widths={widths} order={order} columnConfigs={columnConfigs} tranche={tranche} key={tranche.categoryName} />)
          (tranches)}
    </div>
  )
}

/************************************************************/


const TrancheMatrix = ({ columnConfigs = colConfigs, blocks, categories }) => {
  const [basisWidths] = useAtom(basisWidthsAtom)
  const [columnWidths] = useAtom(columnWidthsAtom)
  const [order] = useAtom(orderAtom)
  const tranches = blocksToTranches(blocks)(values(categories))

  const rowCount = length(categories)


  const widths = useMemo(
    () => calcWidths(columnConfigs)(columnWidths)(basisWidths)
  , [columnConfigs, columnWidths, basisWidths])

  return (
    <section className={`p-2`}>
      <ResizableHeader columnConfigs={columnConfigs} />
      <Body
        columnConfigs={columnConfigs}
        tranches={tranches}
        rowCount={rowCount}
        widths={widths}
        order={order}
      />
    </section>
  )
}

/************************************************************/

const calcColumnData = colCalcs => trns =>
  fold(acc => ([catId, fn]) => concat(acc)({ [catId]: fn(trns) }))
      ({})
      (toPairs(colCalcs))




const TrancheCalculator = ({ columnCalculations = colCalculations, blocks = [], categories = {} }) => {
  const trancheData = map(trc => 
                            ({
                              trancheType: 'naiveCategories',
                              categoryId: trc.categoryId,
                              categoryName: trc.categoryName,
                              columnData: calcColumnData(columnCalculations)
                                                        (trc)
                            }))
                         (blocksToTranches(blocks)
                                          (values(categories)))



  return (
    <div></div>
  )
}

export { TrancheCalculator as TrancheMatrix }