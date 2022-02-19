import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { filter, map } from 'ramda'
import { assocName, getAndStoreBlocks } from './fetches'
import { Block } from './blockData'
import * as L from 'partial.lenses'
import { Matrix } from './matrix/matrix'
import { UserDropdown } from './user/userDropdown'
import { fork } from 'fluture'
import { EditorTargeter } from './editorTargeter'
import { getCategoriesF, getUserBlocksF } from './dbFns'

/*
STATE:
1. If no user is logged in, load no data, display only "log in to continue".
  a) Create a fetch that fetches by current user.
*/


const categoriesAtom = atom([])
const blocksAtom = atom([])
const namedBlocksAtom = atom(
  get => map(assocName(get(categoriesAtom)))
            (get(blocksAtom)),
  (get, set, blks) => set(blocksAtom, blks)
)



const trackerAtom = atom({
  editor: { target: 'draft' }
})


const Tracker = ({ userAtom }) => {
  const [userState, setUserState] = useAtom(userAtom)
  const [categories , setCategories] = useAtom(categoriesAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [namedBlocks] = useAtom(namedBlocksAtom)
  const [trackerState, setTrackerState] = useAtom(trackerAtom)
  // console.log('Categories: ', categories)
  // console.log('Blocks: ', blocks)
  // console.log('NamedBlocks: ', namedBlocks)
  console.log('Draft block: ', filter(blc => blc.isDraft)(namedBlocks))

  const setEditorTarget = id => setTrackerState(L.set(['editor', 'target'], id))

  // useEffect(() => {
  //   if (userState.currentUser !== 'noCurrentUser' && !editorState.editing) {
  //     setEditorState({
  //       editing: 'local',
  //       localBlock: Block.constructor(userState.currentUser)
  //     })
  //   }
  // }, [userState, editorState, setEditorState])
   
  const syncBlocks = () =>
    fork(err => console.log('Failed to fetch blocks.', err))
        (blcs => setBlocks(blcs))
        (getUserBlocksF(userState.currentUser))

  useEffect(() => {
    syncBlocks()

    fork(err => console.log('Failed to fetch categories.', err))
        (cats => setCategories(cats))
        (getCategoriesF(userState.currentUser))
  }, [setBlocks, setCategories, userState])


  return (
    <>
      {userState.currentUser === 'noCurrentUser'
        ? <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='flex flex-col items-center px-4 pt-2 pb-4 space-y-2 rounded-md text-hermit-yellow-400 w-max h-max bg-hermit-grey-900'>
              <p>Login to to use the Tracker</p>
              <UserDropdown 
                users={userState.users} 
                currentUser={userState.currentUser} 
                handleLogin={usr => setUserState(L.set(['currentUser'], usr))} 
              />
            </div>
          </div>
        : <section className={`w-screen grid grid-cols-2`}>
            <div className='w-full'>
              <EditorTargeter
                editorTarget={trackerState.editor.target}
                user={userState.currentUser}
                blocksAtom={namedBlocksAtom}
                categories={categories}
                syncBlocks={syncBlocks}
              />
            </div>

            <div className='w-full pr-2 pb-2'>
              <Matrix blocks={filter(blc => !blc.isDraft)(namedBlocks)} editorTarget={trackerState.editor.target} setEditorTarget={setEditorTarget} />
            </div>
          </section>}
    </>
  )
}

export { Tracker }