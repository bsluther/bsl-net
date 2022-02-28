import { useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import { filter } from 'ramda'
import * as L from 'partial.lenses'
import { Matrix } from './matrix/matrix'
import { UserDropdown } from './user/userDropdown'
import { fork } from 'fluture'
import { EditorTargeter } from './block/editorTargeter'
import { getCategoriesF, getUserBlocksF } from './dbRequests'
import { trackerAtom, blocksAtom, namedBlocksAtom, categoriesAtom, loginAtom } from './atoms'
import { CategoryEditor } from './category/categoryEditor'
import { foldToIdObj } from './functions'



const Tracker = () => {
  const [categories , setCategories] = useAtom(categoriesAtom)
  const [, setBlocks] = useAtom(blocksAtom)
  const [namedBlocks] = useAtom(namedBlocksAtom)
  const [trackerState, setTrackerState] = useAtom(trackerAtom)
  const [, handleLogin] = useAtom(loginAtom)

  const setEditorTarget = id => setTrackerState(L.set(['editor', 'target'], id))

  const syncBlocks = useCallback(
    () =>
      fork(err => console.log('Failed to fetch blocks.', err))
          (blcs => setBlocks(blcs))
          (getUserBlocksF(trackerState.user.currentUser))
  , [setBlocks, trackerState.user.currentUser])

  useEffect(() => {
    syncBlocks()
  }, [syncBlocks])

  useEffect(() => {
    fork(err => console.log('Failed to fetch categories.', err))
        (cats => {
          setCategories(foldToIdObj(cats))
        })
        (getCategoriesF(trackerState.user.currentUser))
  }, [setBlocks, setCategories, trackerState.user, syncBlocks])


  return (
    <>
      {trackerState.user.currentUser === 'noCurrentUser'
        ? <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='flex flex-col items-center px-4 pt-2 pb-4 space-y-2 rounded-md text-hermit-yellow-400 w-max h-max bg-hermit-grey-900'>
              <p>Login to to use the Tracker</p>
              <UserDropdown 
                users={trackerState.user.users} 
                currentUser={trackerState.user.currentUser} 
                handleLogin={handleLogin} 
              />
            </div>
          </div>
        : <section className={`w-screen grid grid-cols-2`}>
            <div className='w-full col-start-1 col-span-1'>
              <EditorTargeter
                editorTarget={trackerState.editor.target}
                setEditorTarget={setEditorTarget}
                user={trackerState.user.currentUser}
                blocksAtom={namedBlocksAtom}
                categories={categories}
                syncBlocks={syncBlocks}
              />
            </div>

            <div className='col-start-1 col-span-1'>
              <CategoryEditor />
            </div>

            <div className='w-full row-start-1 col-start-2 col-span-1 pr-2 pb-2'>
              <Matrix 
                blocks={filter(blc => !blc.isDraft)(namedBlocks)} 
                editorTarget={trackerState.editor.target} 
                setEditorTarget={setEditorTarget} 
                syncBlocks={syncBlocks}
              />
            </div>
          </section>}
    </>
  )
}

export { Tracker }