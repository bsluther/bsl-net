// import { useEffect, useState } from 'react'
import { PeriodCreator } from './tracker/periodCreator'
// import { v4 as uuid } from 'uuid'


const Header = () => {
  return (
    <section className={`
      flex row-start-1 w-full justify-center
      border-black bg-blue-900`}>
      <div className=''>Header HI!</div>
    </section>
  )
}

const App = () => {
  return (
    <section className='grid grid-rows-container font-customMono'>
      <Header />
      <div className='row-start-2'>
        <PeriodCreator />
      </div>
    </section>
  )
}

export default App