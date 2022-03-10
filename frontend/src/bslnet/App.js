import { atom, useAtom } from 'jotai'
import { useLayoutEffect, useState, useRef } from 'react'
import { Tracker } from '../tracker/app/Tracker'
import { Header } from './Header'

const currentAppAtom = atom('tracker')

const appSwitch = {
  tracker: Tracker
}

const App = () => {
  const [currentApp] = useAtom(currentAppAtom)
  const [innerHeight, setInnerHeight] = useState()
  const appRef = useRef()

  useLayoutEffect(() => {
    setInnerHeight(window.innerHeight)
  })

  const CurrentApp = appSwitch[currentApp]

  return (
    <section
      style={{
        height: `${innerHeight}px`
      }}
      className={`font-customMono w-screen grid grid-rows-mainHeader grid-cols-1`}
      ref={appRef}
    >
      <Header />
      <CurrentApp />
    </section>
  )
}

export { App }