import { fork } from 'fluture'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { categoriesAtom, namedBlocks2Atom } from '../atoms'
import useSyncBlocks from '../block/useSyncBlocks'
import { getCategoriesF, getUserBlocksF } from '../dbRequests'
import { foldToIdObj } from '../functions'
import { Create } from '../mobile/Create'
import { History } from '../mobile/History'
import { MobileNav } from '../mobile/MobileNav'

const trackerUserAtom = atom({
  currentUser: 'bsluther',
  users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey', 'sgluther']
})

const primaryNavAtom = atom('create')

const Login = () => {
  return (
    <div className={`absolute top-1/3 left-1/2 p-4 bg-hermit-grey-400 border border-hermit-grey-900 text-red-600`}>You gotta log in!</div>
  )
}

const BrokenLink = () => <div>Sorry, nothing here...</div>

const navHash = {
  'create': Create,
  'history': History
}

const navigate = label => navHash[label] ?? BrokenLink



const Tracker = () => {
  const [userState] = useAtom(trackerUserAtom)
  const [primaryNavState, setPrimaryNavState] = useAtom(primaryNavAtom)
  const [, setCategories] = useAtom(categoriesAtom)
  const syncBlocks = useSyncBlocks()


  useEffect(() => {
    syncBlocks()
  }, [syncBlocks])

  useEffect(() => {
    fork(err => console.log('Failed to fetch categories.', err))
        (cats => {
          setCategories(foldToIdObj(cats))
        })
        (getCategoriesF(userState.currentUser))
  }, [setCategories, userState, syncBlocks])

  if (userState.currentUser === 'noCurrentUser') return (
    <Login />
  )

  const Navigated = navigate(primaryNavState)

  return (
    <>
      <div className='row-start-2 row-end-4 h-full w-full overflow-scroll'>
        <Navigated />
      </div>
      
      
      <div className='row-start-4 row-span-1 overflow-hidden'>
        <MobileNav handleNavClick={label => setPrimaryNavState(label)} />
      </div>
    </>
  )
}

export { Tracker }