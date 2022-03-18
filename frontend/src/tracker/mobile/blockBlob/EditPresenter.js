import { AtomicCategoriesDropdown } from '../../category/categoriesDropdown'
import { categoriesAtom } from '../../atoms'

const SizedInput = ({ charWidth = 2 }) => {
  return (
    <input
      style={{ width: `${charWidth + 0.5}ch`}}
      maxLength={charWidth}
      className={`
      bg-hermit-grey-700 text-center
        outline-none rounded-sm NOTborder border-hermit-grey-700
        focus:outline focus:outline-hermit-yellow-403 outline-offset-1`}
    />
  )
}

const DatePicker = ({ ...props }) => {
  return (
    <input 
      type={'date'}
      className={`bg-hermit-grey-700 appearance-none focus:outline outline-hermit-yellow-403 w-min
        border border-hermit-grey-500 rounded-sm
      `}
      {...props}
    />
  )
}

const TimePicker = ({ ...props }) => {
  return (
    <input 
      type={'time'}
      className={`bg-hermit-grey-700 appearance-none focus:outline outline-hermit-yellow-403 w-32
        border border-hermit-grey-500 rounded-sm
      `}
      {...props}
    />
  )
}

const EditPresenter = ({ category, categoryHandler, startDate, startDateHandler, startTime, startTimeHandler, endTime, endTimeHandler, notes, notesHandler, tags, deleteHandler }) => {

  return (
    <div 
      className={`flex flex-col text-hermit-grey-400 bg-hermit-grey-700 w-full space-y-1 pb-1 px-1 items-end
    `}>
      <DatePicker 
        value={startDate}
        onChange={e => startDateHandler(e.target.value)}
      />

      <div className={`flex space-x-2`}>
        <span className={` text-hermit-grey-400 mt-[2px]`}>Start:</span>
        <TimePicker
          value={startTime}
          onChange={e => startTimeHandler(e.target.value)}
        />
      </div>

      <div className={`flex space-x-2 content-end`}>
        <span className={` text-hermit-grey-400 mt-[2px]`}>End:</span>
        <TimePicker
          value={endTime}
          onChange={e => endTimeHandler(e.target.value)}
        />
      </div>

      <div className={`flex place-self-start w-full space-x-2`}>
        <span>Category:</span>
        <AtomicCategoriesDropdown
          categoriesAtom={categoriesAtom}
          selectedId={category}
          selectHandler={categoryHandler}
          className={`bg-hermit-grey-700 outline-none border border-hermit-grey-500 w-full text-center`}
        />
      </div>

      <div className={`flex place-self-start w-full space-x-2`}>
        <span>Notes:</span>
        <textarea 
          className={`w-full
            bg-hermit-grey-700 border border-hermit-grey-500 rounded-sm outline-none
          `}
          value={notes}
          onChange={e => notesHandler(e.target.value)}
        />
      </div>

    </div>
  )
}

export { EditPresenter }