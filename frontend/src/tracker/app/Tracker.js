import { fork } from 'fluture'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { categoriesAtom, namedBlocks2Atom } from '../atoms'
import { BlockEditor2 } from '../block/blockEditor2'
import { CategoryEditor } from '../category/categoryEditor'
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
  const [, setNamedBlocks2] = useAtom(namedBlocks2Atom)
  const [, setCategories] = useAtom(categoriesAtom)
  const breakpoint = useBreakpoint()

  const syncBlocks = useCallback(
    () =>
      fork(err => console.log('Failed to fetch blocks.', err))
          (blcs => {
            setNamedBlocks2(foldToIdObj(blcs))
          })
          (getUserBlocksF(userState.currentUser))
  , [setNamedBlocks2, userState.currentUser])

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
    <section className={`h-full row-start-2 row-span-1 col-start-1 col-span-1`}>
 
        <div className={`bg-hermit-aqua-500 h-full overflow-scroll`}>
          <Navigated />
        </div>

        {(breakpoint === 'xs' || breakpoint === 'sm') && <MobileNav handleNavClick={label => setPrimaryNavState(label)} />}
    </section>
  )
}

export { Tracker }