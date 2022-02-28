import { append, find, assoc } from 'ramda'
import * as L from 'partial.lenses'
import { Block } from './blockData'
import { BlockEditor } from './blockEditor'
import { useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { deriveTargetBlockAtom } from '../atoms'


const EditorTargeter = ({ editorTarget, setEditorTarget, blocksAtom, user, categories, syncBlocks }) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)

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
    deriveTargetBlockAtom(editorTarget)(blocksAtom)
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