import { useRef, useMemo, useState, useEffect } from 'react'
import { blockStart } from '../block/blockData'
import { maybe, pipe } from 'sanctuary'
import { toFormat } from '../dateTime/pointfree'
import { snakeToSpaced } from '../../util'
import { BlockController } from '../block/BlockController'
import { useAtom } from 'jotai'
import { targetBlockAtom } from '../atoms'
import { fromISO } from '../dateTime/functions'




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
        w-max h-max px-2 space-x-6
         rounded-md bg-hermit-grey-400
        select-none
        ${showBottomBorder && 'border-b rounded-md border-hermit-grey-900'}
      `}
      {...props}
    >
      <span className={`text-hermit-grey-900`}>{maybe('')(toFormat('M/d/yy'))(start)}</span>
      <span className={`text-hermit-grey-700`}>{`${maybe('')(toFormat('ha'))(start)}`}</span>
      <span className={``}>{snakeToSpaced(block.categoryName)}</span>
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

const BodyPresenter = ({ startDate, deleteHandler }) => {
  return (
    <div 
      className={`flex flex-col text-hermit-grey-400
    `}>
      <span>{pipe([fromISO, maybe('')(toFormat('M/d/yy'))])
                 (startDate)}</span>
      <span>two</span>
      <div className={`flex px-2 space-x-2 justify-center`}>
        <Button>Edit</Button>
        <Button clickHandler={deleteHandler} >Delete</Button>
      </div>
    </div>
  )
}

const BodyController = ({ block, setBlock}) => {
  const [targetBlock, setTargetBlock] = useAtom(targetBlockAtom)
  console.log('trg blc', targetBlock)
  return (
    <BlockController 
      Presenter={BodyPresenter}
      block={block}
      setBlock={setBlock}
    />
  )
}

const scrollIntoViewIfNeed = el => {
  const windowRect = document.getElementById('tracker-body-window').getBoundingClientRect()

  if (el.getBoundingClientRect().bottom > windowRect.bottom) {
    el.scrollIntoView(false)
  }

  if (el.getBoundingClientRect().top < windowRect.top) {
    el.scrollIntoView(false)
  }
}

const Expandable = ({ block, setBlock, setTargetBlockId }) => {
  const [expanded, setExpanded] = useState(false)
  const expandableRef = useRef()

  useEffect(() => {
    if (expanded) {
      scrollIntoViewIfNeed(expandableRef.current)
    }
  }, [expanded])

  return (
    <div 
      className={`
        w-max h-max
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
            Presenter={BodyPresenter}
          />

      }
    </div>
  )
}







export { BlockBlob, Expandable as ExpandableBlockBlob }