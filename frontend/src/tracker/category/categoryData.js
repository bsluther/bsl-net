import { catId } from '../utility'
import * as L from 'partial.lenses'
import { includes, append, filter } from 'ramda'

const categoryConstructor = user => ({
  _id: catId(),
  name: undefined,
  creator: user,
})

const addParent = id => category => 
  includes(id)(category.parents ?? []) || id === category._id
    ? category
    : L.modify(['parents'], append(id), category)

const removeParent = id => category =>
  L.modify(['parents'])
          (filter(x => x !== id))
          (category)

const Category = {
  constructor: categoryConstructor,
  addParent,
  removeParent
}



export { Category }