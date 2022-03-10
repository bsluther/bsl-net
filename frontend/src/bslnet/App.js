import { atom, useAtom } from 'jotai'
import { Tracker } from '../tracker/app/Tracker'
import { Header } from './Header'

const currentAppAtom = atom('tracker')

const appSwitch = {
  tracker: Tracker
}

const App = () => {
  const [currentApp] = useAtom(currentAppAtom)

  const CurrentApp = appSwitch[currentApp]

  return (
    <section
      className={`font-customMono w-screen h-screen grid grid-rows-mainHeader grid-cols-1`}
    >
      <Header />
      <CurrentApp />
    </section>
  )
}

export { App }