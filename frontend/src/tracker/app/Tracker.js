import { atom, useAtom } from 'jotai'
import { useBreakpoint } from '../../bslnet/useBreakpoint'
import { BlockEditor2 } from '../block/blockEditor2'
import { CategoryEditor } from '../category/categoryEditor'
import { MobileNav } from './MobileNav'

const trackerUserAtom = atom({
  currentUser: 'bsluther',
  users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey', 'sgluther']
})

const Login = () => {
  return (
    <div className={`absolute top-1/3 left-1/2 p-4 bg-hermit-grey-400 border border-hermit-grey-900 text-red-600`}>You gotta log in!</div>
  )
}

const Tracker = () => {
  const [userState] = useAtom(trackerUserAtom)
  const breakpoint = useBreakpoint()

  console.log((breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md'))

  if (userState.currentUser === 'noCurrentUser') return (
    <Login />
  )

  return (
    <section className={`row-start-2 row-span-1 col-start-1 col-span-1`}>
      <div className={`h-full flex flex-col justify-end`}>
        <div className={`grow bg-hermit-aqua-500`}>test</div>

        <div className={`h-max bg-hermit-aqua-500 space-y-[2px] py-[2px]`}>
          <BlockEditor2 />
          <CategoryEditor />
        </div>
        {(breakpoint === 'xs' || breakpoint === 'sm') && <MobileNav />}
      </div>
    </section>
  )
}

export { Tracker }