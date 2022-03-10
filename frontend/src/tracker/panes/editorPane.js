import { BlockEditor2 } from '../block/blockEditor2'
import { CategoryEditor } from '../category/categoryEditor'


const EditorPane = () => {
  return (
    <section
      className={`border border-hermit-grey-400 h-full space-y-2`}
    >
      <BlockEditor2 />
      <CategoryEditor />
    </section>
  )
}

export { EditorPane }