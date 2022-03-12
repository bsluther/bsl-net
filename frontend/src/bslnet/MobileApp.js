import { atom, useAtom } from 'jotai'
import { Tracker } from '../tracker/app/Tracker'
import { Header } from './Header'

const headerNavAtom = atom('tracker')

const appSwitch = {
  tracker: Tracker
}

const MobileApp = () => {
  const [headerNav] = useAtom(headerNavAtom)
  const LoadedPage = appSwitch[headerNav]

  return (
    <section
      className={`font-customMono h-screen w-screen grid grid-rows-mobileLayout`}
    >
      <div className='row-start-1 row-end-1 overflow-hidden scroll'>
        <Header />
      </div>

      <LoadedPage />

    </section>
  )
}

export { MobileApp }