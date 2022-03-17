import { useMemo, useState } from 'react'
import { blockStart } from '../block/blockData'
import { maybe } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'




const BlockBlob = ({ block, ...props }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div 
      className={`border border-hermit-grey-900 space-x-6 w-max rounded-md px-2 bg-hermit-grey-400 h-max`}
      {...props}
    >
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

const ExpandableBlockBlob = ({ block }) => {
  const [expanded, setExpanded] = useState(false)


  return (
    <div className={`transition-transform
      ${expanded && 'border-b border-x border-hermit-grey-900 h-20'} rounded-md`}>
      <BlockBlob block={block} onClick={() => setExpanded(prev => !prev)}/>
      
    </div>
  )

}

export { BlockBlob, ExpandableBlockBlob }