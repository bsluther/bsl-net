import { useAtom } from 'jotai'
import { fork } from 'fluture'
import * as L from 'partial.lenses'
import { Block } from './blockData'
import { postBlockF } from '../dbRequests'
import { pipe } from 'sanctuary'
import { dissoc } from 'ramda'
import { validate } from '../../Villa/Validation'
import { validators } from './blockValidation'
import { createNewDraftBlockAtom } from '../atoms'
import useSyncBlocks from './useSyncBlocks'

const assocFlatTimes = obj => obj && obj.start && obj.end && 
  ({
    ...obj,
    startDate: obj.start.date,
    startTime: obj.start.time,
    endDate: obj.end.date,
    endTime: obj.end.time
  })

const dissocStartAndEnd = pipe([
  dissoc('start'),
  dissoc('end')
])

const flattenTimes = pipe([
  assocFlatTimes,
  dissocStartAndEnd
])

const BlockController = ({ blockAtom, Presenter }) => {
  const [block, setBlock] = useAtom(blockAtom)
  const [, createNewDraftBlock] = useAtom(createNewDraftBlockAtom)
  const syncBlocks = useSyncBlocks()

  const validation = validate(validators)(flattenTimes(block))
  const isInvalid = validation.isFail

  const setLensedBlock = lens => arg =>
    setBlock(L.set(lens)
                  (arg))

  const getLensedBlock = lens =>
    L.get(lens)
         (block)


  const saveHandler = blc =>
    fork(err => console.error('Block post failed!', err))
        (() => {
          createNewDraftBlock()
          syncBlocks()
        })
        (postBlockF(blc))

  const cancelHandler = () =>
    createNewDraftBlock()
    
  return (
    <Presenter
      isInvalid={isInvalid}

      category={getLensedBlock(Block.category)}
      categoryHandler={setLensedBlock(Block.category)}

      startDate={getLensedBlock(Block.startDate)}
      startDateHandler={setLensedBlock(Block.startDate)}

      startTime={getLensedBlock(Block.startTime)}
      startTimeHandler={setLensedBlock(Block.startTime)}

      endDate={getLensedBlock(Block.endDate)}
      endDateHandler={setLensedBlock(Block.endDate)}

      endTime={getLensedBlock(Block.endTime)}
      endTimeHandler={setLensedBlock(Block.endTime)}

      notes={getLensedBlock(Block.notes)}
      notesHandler={setLensedBlock(Block.notes)}

      tags={getLensedBlock(Block.tags)}
      tagsHandler={setLensedBlock(Block.tags)}

      cancelHandler={cancelHandler}
      saveHandler={() => saveHandler(block)}
    />
  )
}

export { BlockController }