// import { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { Header, headerNavAtom } from './header'
import { Tracker } from './tracker/tracker'
import { trackerAtom } from './tracker/atoms'
import * as L from 'partial.lenses'
import { SvgApp } from './jotaiSvg/App'
/*
TO-DO:
-Update vs save logic
  -Editor should know if it's creating or editing, buttons should reflect
  -Change highlight color when target is changed but not saved
  -Navigating away prompts: "save changes?"
-New block option (when editing a block)
-Matrix: be able to easily change display options (eg format, exclude milliseconds, etc)
-Ghetto Fetch Future (curry2?)
-Get delete button working again
-User created categories
-Matrix sorting/filtering
  -Duration by category
*/



const trackerUserAtom = atom(
  get => get(trackerAtom).user,
  (get, set, _arg) => set(trackerAtom, L.set(['user', 'currentUser'], _arg, (get(trackerAtom))))
)

const BrokenPage = () => 
  <div>
    <p>Sorry, page does not exist...</p>
    <p> Try the Tracker link!</p>
    <p>(Or the SvgApp..)</p>
  </div>
const navSwitch = link => ({
  'Tracker': Tracker,
  'SvgApp': SvgApp
}[link] ?? BrokenPage)

const App = () => {
  const [navState] = useAtom(headerNavAtom)
  console.log('navstate', navState)
  const ActiveApp = navSwitch(navState.activeLink)

  return (
    <section className='grid grid-rows-container font-customMono bg-hermit-aqua-500 h-screen w-screen'>
      <Header userAtom={trackerUserAtom}/>
      <ActiveApp userAtom={trackerUserAtom} />
      {/* <Tracker userAtom={trackerUserAtom} /> */}
    </section>
  )
}

export default App