import { useAtom } from 'jotai'
import { keys } from 'ramda'
import { length } from 'ramda'
import { useEffect } from 'react'
import { createNewDraftBlockAtom, draftBlockAtom } from '../atoms'
import { BlockController } from './BlockController'
import { CreateBlockPresenter } from './CreateBlockPresenter'

const Create = () => {
  const [draftBlock] = useAtom(draftBlockAtom)
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
        blockAtom={draftBlockAtom}
      />
    </section>
  )
}

export { Create }