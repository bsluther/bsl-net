import { join } from 'ramda'
import { pipe, maybe } from 'sanctuary'
import { fromISO } from '../../dateTime/functions'
import { toFormat } from '../../dateTime/pointfree'
import { snakeToSpaced } from '../../functions'

const Button = ({ clickHandler, children }) => {
  return (
    <button
      className={`
        uppercase
        px-1
        bg-hermit-grey-900
        text-hermit-grey-400
      `}
      onClick={clickHandler}
    >{children}</button>
  )
}

const Field = ({ label, children }) => {
  return (
    <div className={`flex space-x-2`}>
      <span className={``}>{`${label}:`}</span>
      {children}
    </div>
  )
}

const ReadOnlyPresenter = ({ categoryName, startDate, startTime, endTime, notes, tags, deleteHandler }) => {

  return (
    <div 
      className={`flex flex-col text-hermit-grey-400 bg-hermit-grey-700 w-full space-y-1 pb-1 px-1
    `}>
      <div className={`flex w-full basis-full`}>
        <span className='grow'>
           {pipe([fromISO, maybe('')(toFormat('M/d/yy'))])
                (startDate)}
         </span>
         <div className={`flex space-x-1`}>
          <span>
            {pipe([fromISO, maybe('')(toFormat('h:mma'))])
                (startTime)}
          </span>
          <span>-</span>
          <span>
          {pipe([fromISO, maybe('')(toFormat('h:mma'))])
               (endTime)}
          </span>
        </div>
      </div>

      <Field label='Category'>
        <span>{snakeToSpaced(categoryName)}</span>
      </Field>

      {notes && notes.length > 0 &&
        <Field label='Notes'>
          <span>{notes}</span>
        </Field>}

      {tags && tags.length > 0 &&
        <Field label='Tags'>
          <span>{join(', ')(tags)}</span>
        </Field>}


      <div className={`flex px-2 space-x-4 justify-end`}>
        <Button clickHandler={() => null}>Edit</Button>
        <Button clickHandler={deleteHandler} >Delete</Button>
      </div>
    </div>
  )
}

export { ReadOnlyPresenter }