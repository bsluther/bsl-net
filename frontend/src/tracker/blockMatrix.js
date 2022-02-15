import { find } from 'ramda'
import { assoc, map, prop, addIndex } from 'ramda'
import { useEffect, useState } from 'react'

/* IMPROVEMNTS:
-use Maybes to handle possibly missing or unloaded data
-treat rows as if there was one: then the do the same thing to every row
*/

const findCategoryById = id => cats => find(cat => prop('id')(cat) === id)(cats)

const assocName = categories => block =>
  assoc('categoryName')
       (prop('name')
            (findCategoryById(prop('category')(block))
                             (categories)))
       (block)

const Row = ({ data, even }) => {
  return (
    <div className={`flex border border-black ${even ? 'bg-pink-400' : null}`}>
      <div className='border border-red-600'>Category: {data.categoryName}</div>
      <div className='border border-red-600'>Start: {data.startInstant}</div>
      <div className='border border-red-600'>End: {data.endInstant}</div>
    </div>
  )
}

const BlockMatrix = () => {
  const [blocks, setBlocks] = useState([])
  const [categories, setCategories] = useState([])
  console.log('categories state:', categories)
  useEffect(() => {
    Promise.all([
      fetch('./tracker/categories').then(res => res.json()),
      fetch('./tracker/blocks').then(res => res.json())
    ])
    .then(([cats, blks]) => {
      setCategories(cats)
      setBlocks(blks)
    })
  }, [setBlocks, setCategories])

  return (
    <div className='flex flex-col'>
      {addIndex(map)((block, index) => <Row key={block._id} data={block} even={(index + 10) % 2 === 0 ? true : false} />)(blocks)}
    </div>
  )
}

export { BlockMatrix }