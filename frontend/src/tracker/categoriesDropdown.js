import { map, prop } from 'ramda'

const name = prop('name')
const id = prop('id')

const CategoriesDropdown = ({ nameIdObjs, selectedId, selectHandler }) =>
  <select>
    {nameIdObjs
      ? map(obj =>
             <option
               id={id(obj)}
               key={id(obj)}
              >
                 {name(obj)}
             </option>)
           (nameIdObjs)
      : <option key='loading'>Loading...</option>}
  </select>

export { CategoriesDropdown }