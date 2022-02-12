import { useEffect } from 'react'
import { v4 as uuid } from 'uuid'
console.log(uuid())
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
  useEffect(() => {
    fetch('./tracker/categories')
    .then(res => res.json())
    .then(data => console.log(data))
  })
  return (
    <section className='grid grid-rows-container font-customMono'>
      <Header />
      <div className='row-start-2'>Lexi Rox!</div>
    </section>
  )
}

export default App