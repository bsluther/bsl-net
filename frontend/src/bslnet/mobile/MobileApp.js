import { useAtom } from 'jotai'
import { Tracker } from '../../tracker/app/Tracker'
import { MobileHeader } from './MobileHeader'
import { bslnetNavAtom } from '../atoms'

const appHash = {
  tracker: Tracker
}

const MissingLink = ({ link }) =>
  <div>{`Sorry, nothing found at link "${link}"...`}</div>

const appSwitch = link =>
  appHash[link] ?? MissingLink


const MobileApp = () => {
  const [navState] = useAtom(bslnetNavAtom)
  const ActivePage = appSwitch(navState.activeLink)

  return (
    <section
      className={`font-customMono h-screen w-screen grid grid-rows-mobileLayout`}
    >
      <div className='row-start-1 row-end-1 overflow-hidden scroll'>
        <MobileHeader />
      </div>

      <div className='row-start-2 row-end-4 overflow-scroll'>
        <ActivePage link={navState.activeLink} />
      </div>

    </section>
  )
}

export { MobileApp }