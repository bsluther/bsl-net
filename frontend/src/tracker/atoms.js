import { atom } from 'jotai'
import { map, find, assoc, prop, dissoc } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './block/blockData'
import { Category } from './category/categoryData'



/***** TRACKER *****/

const trackerAtom = atom({
  user: {
    users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey', 'sgluther'],
    currentUser: 'bsluther'
  },
  editor: { target: 'draft' },
  windows: {
    blockEditor: false,
    categoryEditor: false,
    blockMatrix: false,
    trancheMatrix: true
  }
})

const currentTrackerUserAtom = atom(
  get => get(trackerAtom).user.currentUser
)

const logoutAtom = atom(
  null,
  (get, set) => {
    set(categoriesAtom, {})
    set(blocksAtom, {})
    set(trackerAtom, L.set(['editor', 'target'], 'draft', get(trackerAtom)))
    set(trackerAtom, L.set(['user', 'currentUser'], 'noCurrentUser', get(trackerAtom)))
  }
)

const loginAtom = atom(
  null,
  (get, set, user) => {
    set(trackerAtom,
        L.set(['user', 'currentUser'],
              user,
              get(trackerAtom)))
  }
)

// this looks a lot like COMPOSING EFFECTS...
// time for some MONADS??
const changeUserAtom = atom(
  null,
  (_get, set, user) => {
    set(logoutAtom, null)
    set(loginAtom, user)
  }
)




/***** BLOCKS V2 *****/

const blocksAtom = atom ({})

const namedBlocksAtom = atom(
  get => {
    const blocks2 = get(blocksAtom)
    const categories = get(categoriesAtom)
    
    const res = map(blc => blc.category
                             ? assoc('categoryName')
                                    (L.get([blc.category, 'name'])
                                          (categories))
                                    (blc)
                             : blc)
                   (blocks2)
    return res
  },
  (_get, set, arg) => set(blocksAtom, arg)
)

const targetBlockIdAtom = atom('draft')

const draftBlockAtom = atom({})

const createNewDraftBlockAtom = atom(
  null,
  (get, set, _arg) => {
    const user = get(trackerAtom).user.currentUser
    const newDraft = Block.constructor(user)

    set(draftBlockAtom, newDraft)
  }
)

const targetBlockAtom = atom(
  get => {
    const targetId = get(targetBlockIdAtom)

    if (targetId === 'draft') {
      return get(draftBlockAtom)
    }
    return prop(targetId)
               (get(namedBlocksAtom))
  },

  (get, set, blc) => {
    const targetId = get(targetBlockIdAtom)

    if (targetId === 'draft') {
      set(draftBlockAtom, blc)
    }
    if (targetId !== 'draft') {
      set(namedBlocksAtom, assoc(targetId)(blc)(get(namedBlocksAtom)))
    }
    
  }
)



/***** CATEGORIES *****/

const categoriesAtom = atom({})

const draftCategoryAtom = atom({})
const createNewDraftCategoryAtom = atom(
  null,
  (get, set, _arg) => {
    const user = get(trackerAtom).user.currentUser
    const newDraft = Category.constructor(user)
    set(draftCategoryAtom, newDraft)
  }
)

const targetCategoryIdAtom = atom('draft')

const targetCategoryAtom = atom(
  get => {
    const targetId = get(targetCategoryIdAtom)

    if (targetId === 'draft') {
      return get(draftCategoryAtom)
    }
    return prop(targetId)(get(categoriesAtom))
  },
  (get, set, cat) => {
    const targetId = get(targetCategoryIdAtom)

    if (targetId === 'draft') {
      set(draftCategoryAtom, cat)
    } else {
      set(categoriesAtom, cats => assoc(targetId)(cat)(cats))
    }
  }
)

const saveDraftCategoryAtom = atom(
  null,
  (get, set, _arg) => {
    const newCat = get(targetCategoryAtom)
    set(categoriesAtom, cats => assoc(newCat._id)
                                     (newCat)
                                     (cats))
    set(targetCategoryIdAtom, newCat._id)
    set(createNewDraftCategoryAtom, null)
  }
)

const deleteCategoryAtom = atom(
  null,
  (get, set, deletingId) => {
    const currentTargetId = get(targetCategoryIdAtom)
    if (currentTargetId === deletingId) {
      set(targetCategoryIdAtom, 'draft')
    }
    set(categoriesAtom, cats => dissoc(deletingId)(cats))
  }
)

















/******************************************************************************/


export {
  changeUserAtom,
  currentTrackerUserAtom,

  categoriesAtom,
  targetCategoryAtom,
  targetCategoryIdAtom,
  draftCategoryAtom,
  createNewDraftCategoryAtom,
  saveDraftCategoryAtom,
  deleteCategoryAtom,

  blocksAtom,
  namedBlocksAtom,
  targetBlockIdAtom,
  targetBlockAtom,
  createNewDraftBlockAtom,
  draftBlockAtom
}