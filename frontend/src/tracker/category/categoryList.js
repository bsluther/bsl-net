import { map, values } from 'ramda'
import { PlusCircleSvg } from '../svg'




const CategoryList = ({ categories, selected, handleSelection, listMode, handleRetrieveId }) => {
  const handleItemClick = id => {
    if (listMode === 'selectCategory') {
      console.log('handling select category', id)
      handleSelection(id)
    }
    if (listMode === 'retrieveId') {
      console.log('handling retrieve category id', id)
      handleRetrieveId(id)
    }
  }

  return (
    <div className={`flex flex-col w-96 min-h-full
      border border-hermit-grey-900 ${listMode === 'selectCategory' ? 'bg-hermit-grey-400' : 'bg-gray-100'}`}
    >

      <div className='flex text-hermit-grey-400 bg-hermit-grey-900 justify-center px-1'>
        Categories
      </div>

      <ul className='overflow-y-scroll basis-full'>
        {map(cat =>
          <li
            className={`
              px-1 cursor-pointer ${selected === cat._id ? 'bg-hermit-yellow-403' : ''}
            `}
            key={cat._id} 
            onClick={() => handleItemClick(cat._id)}
          >
            <span className={`
              px-1
              ${listMode === 'retrieveId' && !(selected === cat._id) && 
                'outline outline-hermit-grey-900 hover:bg-hermit-yellow-403 outline-offset-0 rounded-md bg-hermit-grey-400'}
            `}>{cat.name}</span>
          </li>
        )
            (values(categories))}
      </ul>

      <div className='flex h-max justify-end border-t border-hermit-grey-900'>
          <PlusCircleSvg 
            handleClick={() => handleSelection('draft')} 
            styling={`w-6 h-6 text-hermit-grey-900 hover:text-hermit-yellow-403 cursor-pointer`}
            strokeWidth={1.5}
          />
      </div>
    </div>
  )
}



export { CategoryList }