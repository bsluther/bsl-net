import { useMemo } from 'react'
import { blockStart } from '../block/blockData'
import { maybe } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'



const BlockBlob = ({ block }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div className={`border border-hermit-grey-900 space-x-6 w-max rounded-md px-2 bg-hermit-grey-400 h-max`}>
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

export { BlockBlob }