import { toPairs, map, prop, filter, values } from 'ramda'
import { reduce as fold, concat, pipe, justs } from 'sanctuary'
import { blockInRange, blockStartedAfter, blockDuration, sumBlocks } from '../block/blockData'
import { objAgo, emptyDuration } from '../dateTime/functions'
import { toFormat, isDuration, luxonPlus } from '../dateTime/pointfree'
import { MatrixPresenter } from './matrixPresenter'
import { MatrixPresenterTable } from './matrixPresenterTable'
import { blocksToTranches } from '../tranche/functions'
import { useMemo } from 'react'



const colCalculations = {
  category: prop('categoryName'),
  this_month: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockStartedAfter(objAgo({ months: 1 }))),
    sumBlocks,
    toFormat('hh:mm')
  ]),
  last_week: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockInRange(objAgo({ weeks: 2 }))
                       (objAgo({ weeks: 1 }))),
    sumBlocks,
    toFormat('hh:mm')
  ]),
  this_week: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    filter(blockStartedAfter(objAgo({ weeks: 1 }))),
    sumBlocks,
    toFormat('hh:mm')
  ]),
  total: pipe([
    prop('blocks'),
    filter(blc => !blc.isDraft),
    sumBlocks,
    toFormat('hh:mm')
  ])
}

const calcColumnData = colCalcs => trns =>
  fold(acc => ([catId, fn]) => concat(acc)({ [catId]: fn(trns) }))
      ({})
      (toPairs(colCalcs))

const TrancheCalculator = ({ columnCalculations = colCalculations, blocks = [], categories = {} }) => {
  const trancheData = useMemo(() =>
    map(trc => 
         ({
           trancheType: 'naiveCategories',
           categoryId: trc.categoryId,
           categoryName: trc.categoryName,
           columnData: calcColumnData(columnCalculations)
                                     (trc)
         }))
       (blocksToTranches(blocks)
                      (values(categories)))
  , [categories, blocks])



  return (
    <MatrixPresenterTable
      matrixData={trancheData}
    />
  )
}

export { TrancheCalculator }