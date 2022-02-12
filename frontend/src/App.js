import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CategoriesDropdown } from './tracker/categoriesDropdown'

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
  const [categoriesData, setCategoriesData] = useState()
  console.log(categoriesData)
  useEffect(() => {
    fetch('./tracker/categories')
    .then(res => res.json())
    .then(data => setCategoriesData(data))
  }, [setCategoriesData])
  return (
    <section className='grid grid-rows-container font-customMono'>
      <Header />
      <div className='row-start-2'>
        <CategoriesDropdown
          nameIdObjs={categoriesData}
        />
      </div>
    </section>
  )
}

export default App