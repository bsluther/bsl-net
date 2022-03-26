import { useAtom } from 'jotai'
import { map, prop, length, gt, prepend, compose as B, values } from 'ramda'
import { snakeToSpaced } from '../utility'

const name = prop('name')
const id = prop('_id')

const renderOptions = map(obj =>
                          <option value={id(obj)} key={id(obj)}>
                              {B(snakeToSpaced, name)(obj)}
                          </option>)

const defaultStyling = `border border-black round-sm bg-white`

const CategoriesDropdown = ({ className = defaultStyling, nameIdObjs, selectedId, selectHandler, title = 'Choose a category' }) => {
  const loading = nameIdObjs && gt (length(nameIdObjs)) (0)
  return (
    <select
      value={selectedId ? selectedId : 'title'}
      onChange={e => selectHandler(e.target.value)}
      className={className}
    >
      {loading
        ? prepend(<option value='title' key='title' disabled>{title}</option>)
                 (renderOptions(nameIdObjs))
        : <option key='loading'>loading...</option>}
    </select>
  )
}

const AtomicCategoriesDropdown = ({ categoriesAtom, selectedId, selectHandler, title = 'Choose a category', ...props }) => {
  const [categoriesHash] = useAtom(categoriesAtom)
  const categories = values(categoriesHash)
  const loading = gt (length(categories)) (0)

  return (
    <select
      value={selectedId ? selectedId : 'title'}
      onChange={e => selectHandler(e.target.value)}
      {...props}
    >
      {loading
        ? prepend(<option value='title' key='title' disabled>{title}</option>)
                 (renderOptions(categories))
        : <option key='loading'>loading...</option>}
    </select>
  )
}
export { CategoriesDropdown, AtomicCategoriesDropdown }