import { encaseP, chain } from 'fluture'
import { curryN } from 'ramda'

/**************************************
                 BLOCK
**************************************/

const getUserBlocksP = username => {
  fetch(`./tracker/blocks/?user=${username}`)
  .then(res => res.json())
}

const getUserBlocksF = username =>
  encaseP(fetch)(`./tracker/blocks/?user=${username}`)
  .pipe(chain(encaseP(res => res.json())))

const postBlockF = blc =>
  encaseP(curryN(2, fetch)('./tracker/blocks'))
         ({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blc)
        })
  .pipe(chain(encaseP(res => res.json())))

const deleteBlockF = id =>
  encaseP(curryN(2, fetch)('./tracker/blocks'))
         ({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
         })
  .pipe(chain(encaseP(res => res.json())))

  const updateBlockF = blc =>
  encaseP(curryN(2, fetch)('./tracker/blocks'))
         ({
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(blc)
         })
  .pipe(chain(encaseP(res => res.json())))





/**************************************
               CATEGORY
**************************************/

const getCategoriesP = username => {
  fetch(`./tracker/categories/?user=${username}`)
  .then(res => res.json())
}

const getCategoriesF = username =>
  encaseP(fetch)(`./tracker/categories/?user=${username}`)
  .pipe(chain(encaseP(res => res.json())))

const postCategoryF = cat =>
  encaseP(curryN(2, fetch)('./tracker/categories'))
         ({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cat)
        })
  .pipe(chain(encaseP(res => res.json())))

const deleteCategoryF = id =>
  encaseP(curryN(2, fetch)('./tracker/categories'))
         ({
           method: 'DELETE',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id })
         })
  .pipe(chain(encaseP(res => res.json())))

const updateCategoryF = cat =>
  encaseP(curryN(2, fetch)('./tracker/categories'))
         ({
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(cat)
         })
  .pipe(chain(encaseP(res => res.json())))

export {
  getUserBlocksP, getUserBlocksF,
  getCategoriesP, getCategoriesF,
  postBlockF, 
  updateBlockF,
  deleteBlockF,
  postCategoryF, 
  deleteCategoryF,
  updateCategoryF
}