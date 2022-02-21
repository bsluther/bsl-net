import { atom } from 'jotai'
import { map, find, findIndex, update, equals } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './blockData'
import { assocName } from './fetches'


const trackerAtom = atom({
  user: {
    users: ['ari', 'bsluther', 'dolan', 'moontiger', 'whittlesey'],
    currentUser: 'noCurrentUser'
  },
  editor: { target: 'draft' },
})


const categoriesAtom = atom([])

const blocksAtom = atom([])

const namedBlocksAtom = atom(
  get => map(assocName(get(categoriesAtom)))
            (get(blocksAtom)),
  (get, set, blks) => set(blocksAtom, blks)
)

/******************************************************************************/
// HANDLERS

const logoutAtom = atom(
  null,
  (get, set) => {
    set(categoriesAtom, [])
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




/******************************************************************************/






/******************************************************************************/
// DERIVE TARGET ATOM

const findIndexById = id => blcs => findIndex(blc => blc._id === id)(blcs)
const updateById = x => id => blcs => update(findIndexById(id)(blcs))(x)(blcs)

const deriveTargetAtom = str => blcsAtom =>
  str === 'draft'
    ? atom(
      get => find(blc => blc.isDraft)(get(blcsAtom)),
      (get, set, _arg) => set(blcsAtom,
                              updateById(_arg)
                                        (L.get(Block.id)(_arg))
                                        (get(blcsAtom)))
    )
    : atom(
      get => find(blc => L.get(Block.id)(blc) === str)(get(blcsAtom)),
      (get, set, _arg) => set(blcsAtom,
                          updateById(_arg)
                                    (L.get(Block.id)(_arg))
                                    (get(blcsAtom)))
    )

/******************************************************************************/


export {
  trackerAtom,
  blocksAtom,
  namedBlocksAtom,
  categoriesAtom,
  deriveTargetAtom,
  loginAtom,
  logoutAtom,
  saveBlockAtom,
  findIndexById
}