import { append, find, assoc, equals } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './blockData'
import { BlockEditor } from './blockEditor'
import { useEffect, useMemo } from 'react'
import { atom, useAtom } from 'jotai'
import { deriveTargetAtom } from './atoms'

// Move the deriveTargetAtom computation into a ref




const EditorTargeter = ({ editorTarget, setEditorTarget, blocksAtom, user, categories, syncBlocks }) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  console.log('editor target: ', editorTarget)

  const undraftBlock = id =>
    setBlocks(L.modify(
      [L.find(blc => blc._id === id)], 
      L.set(['isDraft'], undefined), 
      blocks
    ))

  // if target is draft, and no draft exists, create a draft
  useEffect(() => {
    if (editorTarget === 'draft' && !find(blc => blc.isDraft)(blocks)) {
      setBlocks(
        append(assoc('isDraft')(true)(Block.constructor(user)))
              (blocks)
      )
    }
  }, [user, editorTarget, blocks, setBlocks])

  // create an attempt pointing to the target block
  const targetAtom = useMemo(() => 
    deriveTargetAtom(editorTarget)(blocksAtom)
  , [editorTarget, blocksAtom])

  return (
    <BlockEditor
      editingAtom={targetAtom}
      categories={categories}
      syncBlocks={syncBlocks}
      editorTarget={editorTarget}
      setEditorTarget={setEditorTarget}
      undraftBlock={undraftBlock}
    />
  )
}

export { EditorTargeter }