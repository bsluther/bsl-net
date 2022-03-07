import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import * as L from 'partial.lenses'
import { map, propOr, values } from 'ramda'
import { categoriesAtom, deleteCategoryAtom, targetCategoryAtom, targetCategoryIdAtom, createNewDraftCategoryAtom, saveDraftCategoryAtom } from '../atoms'
import { deleteCategoryF, postCategoryF, updateCategoryF } from '../dbRequests'
import { fork } from 'fluture'
import { Category } from './categoryData'
import { CategoryList } from './categoryList'
import { MinusCircleSvg, MinusSvg, PlusSvg, XSvg } from '../svg'




const ParentCategoryBlob = ({ name, handleRemoveParent }) =>
  <div className='flex space-x-1 items-center'>
    <button className='bg-hermit-grey-400 text-hermit-grey-900 border border-hermit-grey-900 rounded-md px-2'>{name}</button>
    <MinusCircleSvg onClick={handleRemoveParent} className={`w-5 h-5 cursor-pointer text-white hover:text-hermit-yellow-403`} fill='currentColor' stroke='rgb(38 38 38)' />
  </div>

const ParentCategoryInterface = ({ category, categories, listMode, setListMode, handleRemoveParent }) =>
  <div className='flex space-x-2 text-sm'>
    <p className='self-center font-extrabold tracking-tight leading-tight'>Parent Categories:</p>

    <div className='w-full border border-hermit-grey-900 rounded-sm space-y-2 bg-white p-1'>
      {map(catId =>
              <ParentCategoryBlob 
                key={catId} 
                name={L.get([catId, 'name'], categories)} 
                handleRemoveParent={() => handleRemoveParent(catId)} 
              />)
          (category.parents ?? [])
      }

      <div
        className={`h-6 flex items-center w-max text-hermit-grey-900 border border-hermit-grey-900 rounded-md px-1 space-x-4
        ${listMode === 'retrieveId' ? 'bg-hermit-yellow-403' : 'bg-gray-100'}
        `}
      >
        {listMode === 'retrieveId'
          ? <>
              <p className='italic'>select a category</p>
              <XSvg 
                className={`w-4 h-4 hover:border hover:border-hermit-grey-900 hover:rounded-md cursor-pointer`}
                onClick={() => setListMode('selectCategory')}
              />
            </>
          : <PlusSvg
              className={`hover:text-hermit-yellow-403 h-4 w-4 cursor-pointer`}
              onClick={() => setListMode('retrieveId')}
              strokeWidth={3}
            />}
        
        
      </div>
    </div>
  </div>
  

const ActionMenu = ({ handleDeleteCategory, handleSaveDraftCategory, updating, handleUpdateCategory }) => {
  return (
    <div className='flex basis-full justify-end space-x-2'>

      {!updating || 
        (<button
          className={`self-end
            bg-hermit-grey-900 text-hermit-grey-400 rounded-md px-2 hover:text-hermit-yellow-403
          `}
          onClick={handleDeleteCategory}
        >Delete Category</button>)}
      {
        updating
          ? <button
              className={`self-end bg-hermit-grey-900 text-hermit-grey-400 rounded-md px-2 hover:text-hermit-yellow-403`}
              onClick={handleUpdateCategory}
            >Update Category</button>
          : <button
              className={`self-end bg-hermit-grey-900 text-hermit-grey-400 rounded-md px-2 hover:text-hermit-yellow-403`}
              onClick={handleSaveDraftCategory}
            >Save Category</button>
      }
      
    </div>
  )
}

const CatPresenter = ({ category, setCategory, categories, targetCategoryId, setTargetCategoryId, handleSaveDraftCategory, handleDeleteCategory, handleUpdateCategory, handleAddParent, handleRemoveParent }) => {
  const [listMode, setListMode] = useState('selectCategory')

  return (
    <div className={`w-192 h-max flex p-1
      border-2 rounded-sm border-hermit-grey-900 bg-hermit-grey-400`}>
      <CategoryList
        categories={categories}
        selected={targetCategoryId}
        handleSelection={setTargetCategoryId}
        listMode={listMode}
        handleRetrieveId={id => {
          setListMode('selectCategory')
          handleAddParent(id)
        }}
      />
      <div className={`flex flex-col w-144 basis-full px-2 space-y-2`}>

        <div
          className='self-center w-max underline rounded-sm px-2'
        >{targetCategoryId === 'draft' ? 'New Category:' : 'Editing:'}</div>

        <div className='flex space-x-2'>
          <p className='font-extrabold tracking-tight'>Name:</p>
          <input
            className={`bg-white border border-hermit-grey-900 rounded-sm px-1`}
            value={propOr('')('name')(category)}
            onChange={e => setCategory(L.set(['name'], e.target.value, category))} />
        </div>

        <ParentCategoryInterface 
          category={category}
          categories={categories}
          listMode={listMode}
          setListMode={setListMode}
          handleRemoveParent={handleRemoveParent}
        />
        

        <ActionMenu
          handleDeleteCategory={() => handleDeleteCategory(category._id)}
          handleSaveDraftCategory={handleSaveDraftCategory}
          updating={targetCategoryId !== 'draft'}
          handleUpdateCategory={() => handleUpdateCategory(category)}
        />

      </div>
    </div>
  )
}



const CategoryEditor = () => {
  const [categories] = useAtom(categoriesAtom)
  const [category, setCategory] = useAtom(targetCategoryAtom)
  const [, createNewDraftCategory] = useAtom(createNewDraftCategoryAtom)
  const [targetCategoryId, setTargetCategoryId] = useAtom(targetCategoryIdAtom)
  const [, saveDraftCategory] = useAtom(saveDraftCategoryAtom)
  const [, deleteCategory] = useAtom(deleteCategoryAtom)

  const handleSaveDraftCategory = () => 
    fork(err => console.error('Category post failed!', err))
        (res => saveDraftCategory())
        (postCategoryF(category))

  const handleDeleteCategory = id => 
    fork(err => console.error('Category deletion failed!', err))
        (res => deleteCategory(id))
        (deleteCategoryF(id))

  const handleUpdateCategory = cat =>
    fork(err => console.error('Category update failed!', err))
        (res => console.log('Category update successful!', res))
        (updateCategoryF(cat))

  const handleAddParent = id =>
    setCategory(Category.addParent(id)(category))

  const handleRemoveParent = id =>
    setCategory(Category.removeParent(id)(category))
  

  useEffect(() => {
    createNewDraftCategory()
  }, [createNewDraftCategory])

  return (
    <CatPresenter
      category={category} 
      setCategory={setCategory} 
      categories={categories}
      targetCategoryId={targetCategoryId}
      setTargetCategoryId={setTargetCategoryId}

      handleSaveDraftCategory={handleSaveDraftCategory}
      handleDeleteCategory={handleDeleteCategory}
      handleUpdateCategory={handleUpdateCategory}

      handleAddParent={handleAddParent}
      handleRemoveParent={handleRemoveParent}
    />
  )
}

export { CategoryEditor }