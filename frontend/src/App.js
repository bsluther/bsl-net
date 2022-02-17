// import { useEffect, useState } from 'react'
import { atom } from 'jotai'
import { Header } from './header'
import { Tracker } from './tracker/tracker'

/*
TO-DO:
-Use my own IDs instead of Mongos
-Category -> Categories
-Users
-Create categories
-Matrix sorting/filtering
  -Duration by category
*/

const userAtom = atom({
  users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey'],
  currentUser: 'noCurrentUser',

})

const App = () => {

  return (
    <section className='grid grid-rows-container font-customMono bg-hermit-aqua-500 h-screen w-screen'>
      <Header userAtom={userAtom}/>
      <Tracker />
      {/* <div className='row-start-2'>
        <BlockCreator categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div>

      <div className='row-start-2 col-start-2'>
        <BlockMatrix categoriesAtom={categoriesAtom} blocksAtom={namedBlocksAtom} />
      </div> */}
      
    </section>
  )
}

export default App