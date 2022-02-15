// import { useEffect, useState } from 'react'
import { BlockCreator } from './tracker/blockCreator'
import { BlockMatrix } from './tracker/blockMatrix'


const Header = () => {
  return (
    <section className={`
      flex row-start-1 row-end-2 col-start-1 col-end-3 w-full justify-center
      border-black bg-blue-900`}>
      <div className=''>BSL</div>
    </section>
  )
}

const App = () => {
  return (
    <section className='grid grid-rows-container grid-cols-2 font-customMono'>
      <Header />
      <div className='row-start-2'>
        <BlockCreator />
      </div>

      <div className='row-start-2 col-start-2 bg-gray-400'>
        <BlockMatrix />
      </div>
      
    </section>
  )
}

export default App