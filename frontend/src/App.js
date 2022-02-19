// import { useEffect, useState } from 'react'
import { atom } from 'jotai'
import { Header } from './header'
import { Tracker, trackerUserAtom } from './tracker/tracker'

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



const App = () => {

  return (
    <section className='grid grid-rows-container font-customMono bg-hermit-aqua-500 h-screen w-screen'>
      <Header userAtom={trackerUserAtom}/>
      <Tracker userAtom={trackerUserAtom} />
    </section>
  )
}

export default App