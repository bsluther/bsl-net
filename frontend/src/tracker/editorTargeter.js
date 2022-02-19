import { append, find, assoc, findIndex, update } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './blockData'
import { BlockEditor } from './blockEditor'
import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'

// Move the deriveTargetAtom computation into a ref

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




const EditorTargeter = ({ editorTarget, blocksAtom, user, categories, syncBlocks }) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  console.log('editor target: ', editorTarget)
  useEffect(() => {
    if (editorTarget === 'draft' && !find(blc => blc.isDraft)(blocks)) {
      setBlocks(
        append(assoc('isDraft')(true)(Block.constructor(user)))
              (blocks)
      )
    }
  }, [user, editorTarget, blocks, setBlocks])

  return (
    <BlockEditor
      editingAtom={deriveTargetAtom(editorTarget)(blocksAtom)}
      categories={categories}
      syncBlocks={syncBlocks}
    />
  )
}

export { EditorTargeter }