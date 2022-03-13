import { useState } from 'react'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import * as L from 'partial.lenses'
import { draftFilterConfigAtom, saveDraftFilterConfigAtom } from '../state/filterAtoms'



const DatePicker = (props) => {
  return (
    <input
      className={`bg-hermit-grey-900 border border-hermit-grey-700 rounded-md h-max`}
      type='date'
      {...props}
    />
  )
}

const DateDialog = ({ endEditing }) => {
  const [draftFilterConfig, setDraftFilterConfig] = useAtom(draftFilterConfigAtom)
  const resetDraft = useResetAtom(draftFilterConfigAtom)
  const [, saveDraftFilterConfig] = useAtom(saveDraftFilterConfigAtom)

  return (
    <div className={`flex flex-col h-full basis-full space-y-4`}>

      <div className={`flex items-center justify-center px-4 space-x-4`}>
        <div className='flex flex-col'>
          <span className='-mb-2'>Show</span>
          <span>data</span>
        </div>
        <select 
          className='bg-hermit-grey-900 border border-hermit-grey-400 rounded-md outline-none'
          onChange={e => setDraftFilterConfig(L.set(['logic'])
                                                   (e.target.value)
                                                   (draftFilterConfig))}
          value='gte'
        >
          <option value='lte'>before</option>
          <option value='gte'>after</option>
        </select>

        <DatePicker 
          value={draftFilterConfig.parameter} 
          onChange={e => setDraftFilterConfig(L.set(['parameter'])
                                                   (e.target.value)
                                                   (draftFilterConfig))}/>
      </div>

      <div className='flex justify-center items-center grow space-x-4'>
        <button 
          className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
          onClick={() => {
            resetDraft()
            endEditing()
          }}
        >Cancel</button>
        <button 
          className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
          onClick={() => {
            if (draftFilterConfig.logic && draftFilterConfig.parameter) {
              saveDraftFilterConfig()
              resetDraft()
              endEditing()
            }
          }}
        >Set Filter</button>
      </div>

    </div>
  )
}

const FilterDialog = ({ endEditing }) => {
  const [filterType, setFilterType] = useState()

  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2
      w-11/12 h-max p-2 space-y-4
      flex flex-col items-center
      text-hermit-grey-400 bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
    `}>
      <div className={`space-x-4 `}>
        <span>Filter by:</span>
        
        <span 
          className={`uppercase px-1 ${filterType === 'date' && `outline outline-hermit-grey-400`}`}
          onClick={() => setFilterType('date')}
        >date</span>
        
        <span>or</span>
        
        <span 
          className={`uppercase px-1 ${filterType === 'category' && `outline outline-hermit-grey-400`}`}
          onClick={() => setFilterType('category')}
        >category</span>
      </div>
      
      {filterType === 'date' 
        ? <div className='grow'>
            <DateDialog 
              endEditing={endEditing}
            /> 
          </div>
        : null}

        {!filterType
          ? <button 
              className={`text-hermit-grey-400 bg-hermit-grey-700 rounded-md px-2 h-max`}
              onClick={endEditing}
            >Cancel</button>
          : null}

    </div>
  )
}

export { FilterDialog }