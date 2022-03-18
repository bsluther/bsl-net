import { useRef, useMemo, useState, useEffect } from 'react'
import { blockStart } from '../../block/blockData'
import { maybe } from 'sanctuary'
import { toFormat } from '../../dateTime/pointfree'
import { snakeToSpaced, scrollIntoViewIfNeeded } from '../../../util'
import { BlockController } from '../../block/BlockController'
import { ReadOnlyPresenter } from '../blockBlob/ReadOnlyPresenter'
import { EditPresenter } from './EditPresenter'
import { map, values } from 'ramda'
import * as L from 'partial.lenses'

const Blob = ({ block, expanded, ...props }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div 
      className={`
        w-full h-max
        odd:bg-hermit-grey-400NOT even:bg-hermit-grey-500NOT
        select-none flex justify-center-center
        ${expanded && 'border-b rounded-b-sm border-hermit-grey-900'}
      `}
      {...props}
    >
      <span className={`text-center w-1/4 text-hermit-grey-700  border-hermit-grey-900 border-r`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-center w-1/4 text-hermit-grey-700 border-hermit-grey-900 border-r`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={`pl-1 first-line:w-1/2`}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

const Expandable = ({ block, setBlock, setTargetBlockId }) => {
  const [expanded, setExpanded] = useState(false)
  const expandableRef = useRef()

  useEffect(() => {
    if (expanded) {
      scrollIntoViewIfNeeded(expandableRef.current)
    }
  }, [expanded])

  return (
    <div 
      className={`
        w-80 h-max
        border-b last:border-0 border-hermit-grey-900
        odd:bg-hermit-grey-400 even:bg-hermit-grey-500
        ${expanded && 'outline mb-[1px]'}
      `}
      ref={expandableRef}
    >
      <Blob 
        block={block} 
        onClick={() => {
          setTargetBlockId(block._id)
          setExpanded(prev => !prev)
        }}
        expanded={expanded}
      />
      {expanded &&
          <BlockController
            block={block}
            setBlock={setBlock}
            Presenter={EditPresenter}
          />

      }
    </div>
  )
}

const BlobCollection = ({ blocks, setBlocks, setTargetBlockId }) => {

  return (
    <div 
      className={`
        flex flex-col w-max items-center justify-center
        border border-hermit-grey-900
      `}>
      {map(blc => 
            <Expandable 
              block={blc}
              setBlock={arg => {
                if (typeof arg === 'function') {
                  setBlocks(prev => L.set([blc._id])
                                         (arg(L.get([blc._id])
                                                   (prev)))
                                         (prev))
                }
                if (typeof arg !== 'function') {
                  setBlocks(prev => L.set([blc._id])
                                         (arg)
                                         (prev))
                }
              }}
              key={blc._id} 
              setTargetBlockId={setTargetBlockId}

            />)
          (values(blocks))}
    </div>
  )
}

export { 
  Expandable as TableBlockBlob, 
  BlobCollection as ExpandableBlobTable 
}