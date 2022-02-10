import { useEffect } from 'react'

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
    fetch('./test')
    .then(res => res.text())
    .then(data => console.log(data))
  })
  return (
    <section className='grid grid-rows-container'>
      <Header />
      <div className='row-start-2'>Lexi Rox!</div>
    </section>
  )
}

export default App