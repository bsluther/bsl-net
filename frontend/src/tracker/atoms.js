import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { map, find, assoc, prop, dissoc } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './block/blockData'
import { updateById, assocCatNameToBlock } from './functions'
import { Category } from './category/categoryData'



/***** TRACKER *****/

const trackerAtom = atom({
  user: {
    users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey', 'sgluther'],
    currentUser: 'noCurrentUser'
  },
  editor: { target: 'draft' },
  windows: {
    blockEditor: false,
    categoryEditor: false,
    blockMatrix: false,
    trancheMatrix: true
  }
})

const logoutAtom = atom(
  null,
  (get, set) => {
    set(categoriesAtom, {})
    set(blocksAtom, [])
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


/***** BLOCKS *****/

const blocksAtom = atom([])

const namedBlocksAtom = atom(
  get => map(blc => assocCatNameToBlock(get(categoriesAtom))(blc))
            (get(blocksAtom)),
  (_get, set, blks) => set(blocksAtom, blks)
)

const saveBlockAtom = atom(
  null,
  (get, set, blcId) => {
    // Set editorTarget to the ID of the saved block
    set(trackerAtom,
        L.set(
          ['editor', 'target'],
          blcId,
          get(trackerAtom)
        )
    )

    // Remove isDraft property from the saved block
    set(blocksAtom,
        L.set(
          [L.find(x => L.get([Block.id], x) === blcId), 'isDraft'],
          undefined,
          get(blocksAtom)
        ))

  }
)

const deriveTargetBlockAtom = str => blcsAtom =>
  str === 'draft'
    ? atom(
      get => find(blc => blc.isDraft)(get(blcsAtom)),
      (get, set, arg) => set(blcsAtom,
                              updateById(arg)
                                        (L.get(Block.id)(arg))
                                        (get(blcsAtom)))
    )
    : atom(
      get => find(blc => L.get(Block.id)(blc) === str)(get(blcsAtom)),
      (get, set, arg) => set(blcsAtom,
                          updateById(arg)
                                    (L.get(Block.id)(arg))
                                    (get(blcsAtom)))
    )

/***** CATEGORIES *****/

const categoriesAtom = atom({})

// const draftCategoryAtom = atomWithReset(
//   get => {
//     console.log('get tracker atom: ', get(trackerAtom))
//     return Category.constructor(get(trackerAtom).user.currentUser)
//   },
//   (_get, set, cat) => set(draftCategoryAtom, cat)
// )

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
    console.log('setTargetCategory call, cat:', cat)
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

// const deriveTargetCategoryAtom = targetId =>
















/******************************************************************************/


export {
  trackerAtom,
  blocksAtom,
  namedBlocksAtom,
  categoriesAtom,
  deriveTargetBlockAtom,
  loginAtom,
  logoutAtom,
  saveBlockAtom,
  changeUserAtom,
  targetCategoryAtom,
  targetCategoryIdAtom,
  draftCategoryAtom,
  createNewDraftCategoryAtom,
  saveDraftCategoryAtom,
  deleteCategoryAtom
}