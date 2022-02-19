// import { useEffect, useState } from 'react'
import { atom } from 'jotai'
import { Header } from './header'
import { Tracker } from './tracker/tracker'

/*
TO-DO:
-Update vs save logic
-New block option (when editing a block)
-Ghetto Fetch Future (curry2?)
-Get delete button working again
-User created categories
-Matrix sorting/filtering
  -Duration by category
*/

const userAtom = atom({
  users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey'],
  currentUser: 'noCurrentUser'
})

const App = () => {

  return (
    <section className='grid grid-rows-container font-customMono bg-hermit-aqua-500 h-screen w-screen'>
      <Header userAtom={userAtom}/>
      <Tracker userAtom={userAtom} />
    </section>
  )
}

export { userAtom }
export default App