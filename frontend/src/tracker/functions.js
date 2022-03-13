import { assoc, find, findIndex, prop, update, replace, reduce } from 'ramda'
import { v4 as uuid } from 'uuid'

const isTypeof = typeStr => x => typeof x === typeStr

/*****  *****/
// OLD, based on an array
const findCategoryById = id => cats => find(cat => prop('_id')(cat) === id)(cats)
const assocName = categories => block =>
  assoc('categoryName')
       (prop('name')
            (findCategoryById(prop('category')(block))
                             (categories)))
       (block)

/*****  *****/

const findIndexById = id => blcs => findIndex(blc => blc._id === id)(blcs)
const updateById = x => id => blcs => update(findIndexById(id)(blcs))(x)(blcs)

/*****  *****/

const makeId = prefix => `${prefix}-${uuid()}`
const blcId = () => makeId('blc')
const catId = () => makeId('cat')

/*****  *****/

const snakeToSpaced = replace(/_/g)(' ')

/*****  *****/

const assign = target => src => Object.assign({}, target, src)
const keyById = obj => ({ [obj._id]: obj })
const foldToIdObj = reduce((acc, x) => assign(acc)(keyById(x)))
                          ({})

/*****  *****/

const assocCatNameToBlock = categories => block => {
     const catId = prop('category')(block)
     const cat = prop(catId)(categories)
     const catName = prop('name')(cat)
     const namedBlc = assoc('categoryName')(catName)(block)
     return namedBlc
}


/*****  *****/


export { assocName, findIndexById, updateById, snakeToSpaced, blcId, catId, foldToIdObj, assocCatNameToBlock, isTypeof }