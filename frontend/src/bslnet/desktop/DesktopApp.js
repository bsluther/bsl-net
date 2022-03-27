import { DesktopHeader } from './DesktopHeader'
// import { LandingController } from '../../tracker/desktop/landing/Landing'
import { useAtom } from 'jotai'
import { bslnetNavAtom } from '../atoms'
import { Layout } from '../../tracker/desktop/Layout'

const appHash = {
  tracker: Layout
}

const MissingLink = ({ link }) =>
  <div>{`Sorry, nothing found at link "${link}"...`}</div>

const appSwitch = link =>
  appHash[link] ?? MissingLink

const DesktopApp = () => {
  const [navState] = useAtom(bslnetNavAtom)
  const ActivePage = appSwitch(navState.activeLink)

  return (
    <section
      className={`font-customMono h-screen w-screen grid grid-rows-mainHeader grid-cols-1`}
    >
      <DesktopHeader />
      <ActivePage link={navState.activeLink} />
    </section>
  )
}

export { DesktopApp }