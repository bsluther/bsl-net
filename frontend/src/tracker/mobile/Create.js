import { useAtom } from 'jotai'
import { keys } from 'ramda'
import { length } from 'ramda'
import { useEffect } from 'react'
import { createNewDraftBlockAtom, draftBlockAtom } from '../atoms'
import { BlockController } from '../block/BlockController'
import { CreateBlockPresenter } from './CreateBlockPresenter'

const Create = () => {
  const [draftBlock, setDraftBlock] = useAtom(draftBlockAtom)
  const [, createNewDraftBlock] = useAtom(createNewDraftBlockAtom)

  useEffect(() => {
    if (length(keys(draftBlock)) === 0) {
      createNewDraftBlock()
    }
  }, [draftBlock, createNewDraftBlock])
  
  return (
    <section className={`h-full flex flex-col justify-center overflow-scroll`}>
      <BlockController
        Presenter={CreateBlockPresenter}
        // blockAtom={draftBlockAtom}
        block={draftBlock}
        setBlock={setDraftBlock}
      />
    </section>
  )
}

export { Create }