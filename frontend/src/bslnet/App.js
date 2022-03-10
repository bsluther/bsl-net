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
  const [innerWidth, setInnerWidth] = useState()
  const appRef = useRef()

  useLayoutEffect(() => {
    setInnerHeight(window.innerHeight)
    setInnerWidth(window.innerWidth)
  })

  const CurrentApp = appSwitch[currentApp]

  return (
    <section
      style={{
        height: `${innerHeight}px`,
        Width: `${innerWidth}px`
      }}
      className={`font-customMono h-screen w-screen grid grid-rows-mainHeader grid-cols-1 overflow-hidden`}
      ref={appRef}
    >
      <Header />
      <CurrentApp />
    </section>
  )
}

export { App }