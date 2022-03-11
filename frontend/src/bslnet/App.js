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

  const CurrentApp = appSwitch[currentApp]

  return (
    <section
      className={`font-customMono h-screen w-screen grid grid-rows-mainHeader grid-cols-1`}
    >
      <Header />
      <CurrentApp />
    </section>
  )
}

export { App }