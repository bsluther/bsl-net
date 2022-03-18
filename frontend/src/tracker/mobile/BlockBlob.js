import { useRef, useMemo, useState, useEffect } from 'react'
import { blockStart } from '../block/blockData'
import { maybe, pipe } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'
import { BlockController } from '../block/BlockController'
import { ReadOnlyPresenter } from './blockBlob/ReadOnlyPresenter'


const scrollIntoViewIfNeeded = el => {
  const trackerBody = document.getElementById('tracker-body')
  const bodyRect = trackerBody.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  if (elRect.bottom > bodyRect.bottom) {
    el.scrollIntoView(false)
  }

  if (elRect.top < bodyRect.top) {
    el.scrollIntoView(false)
  }
}




const BlockBlob = ({ block, ...props }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div 
      className={`
        w-max h-max px-2 space-x-6
        border rounded-md border-hermit-grey-900 bg-hermit-grey-400
        select-none
      `}
      {...props}
    >
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}







const HeaderBlockBlob = ({ block, showBottomBorder, ...props }) => {
  const start = useMemo(() => blockStart(block), [block])

  return (
    <div 
      className={`
        w-full
        h-max px-2
        rounded-md bg-hermit-grey-400
        select-none flex
        ${showBottomBorder && 'border-b rounded-md border-hermit-grey-900'}
      `}
      {...props}
    >
      <span className={`text-hermit-grey-700 w-1/4`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700 w-1/4`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={`w-1/2`}>{snakeToSpaced(block.categoryName)}</span>
    </div>
  )
}

const Button = ({ clickHandler, children }) => {
  return (
    <button
      className={`
        uppercase
        px-1
        bg-hermit-grey-900
      `}
      onClick={clickHandler}
    >{children}</button>
  )
}

const Field = ({ label, children }) => {
  return (
    <div className={`flex space-x-2`}>
      <span>{`${label}:`}</span>
      {children}
    </div>
  )
}

const SubtleInput = ({ value, handler, notSubtle }) => {
  return (
    <input
      className={`
        w-max h-max bg-hermit-grey-700 outline-none
        ${notSubtle && 'border border-hermit-grey-400'}
      `}
      value={value}
      onChange={e => handler(e.target.value)}
    />
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
        border rounded-md border-hermit-grey-900 bg-hermit-grey-700
      `}
      ref={expandableRef}
    >
      <HeaderBlockBlob 
        block={block} 
        onClick={() => {
          setTargetBlockId(block._id)
          setExpanded(prev => !prev)
        }}
        showBottomBorder={expanded}
      />
      {expanded &&
          <BlockController
            block={block}
            setBlock={setBlock}
            Presenter={ReadOnlyPresenter}
          />

      }
    </div>
  )
}







export { BlockBlob, Expandable as ExpandableBlockBlob }