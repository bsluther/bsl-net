import { prop, assoc, find } from 'ramda'

const deleteBlock = id =>
  fetch('./tracker/blocks', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  .then(res => res.json()
  .then(x => console.log(x)))

/**************************************/

const postBlock = block => 
  fetch('./tracker/blocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(block)
  })
  .then(res => res.json())


/**************************************/

const getAndStoreCategories = setter => {
  fetch('./tracker/categories')
    .then(res => res.json())
    .then(data => setter(data))
}


/**************************************/

const getAndStoreCatsAndBlocks = catSetter => blkSetter => {
  Promise.all([
    fetch('./tracker/categories').then(res => res.json()),
    fetch('./tracker/blocks').then(res => res.json())
  ])
  .then(([cats, blks]) => {
    catSetter(cats)
    blkSetter(blks)
  })
}

const findCategoryById = id => cats => find(cat => prop('id')(cat) === id)(cats)

const assocName = categories => block =>
  assoc('categoryName')
       (prop('name')
            (findCategoryById(prop('category')(block))
                             (categories)))
       (block)

/**************************************/

const getAndStoreBlocks = blkSetter => {
  fetch('./tracker/blocks')
  .then(res => res.json())
  .then(blks => blkSetter(blks))
}

export { postBlock, getAndStoreCategories, getAndStoreCatsAndBlocks, getAndStoreBlocks, deleteBlock, assocName }