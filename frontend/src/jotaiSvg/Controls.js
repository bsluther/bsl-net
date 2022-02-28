import { useAtom } from 'jotai'
import { map } from 'ramda'
import { setColorAtom } from './selection'
import { deleteSelectedShapeAtom } from './SvgShapes'
import { undoAtom } from './history'


const colors = [
  { value: '', label: 'Default' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]

const Controls = () => {
  const [color, setColor] = useAtom(setColorAtom)
  const [isSelected, deleteSelectedShape] = useAtom(deleteSelectedShapeAtom)
  const [hasHistory, undo] = useAtom(undoAtom)

  return (
    <div>
      <div className='flex h-max space-x-2'>
        <p>Color:</p>
        {map(({ value, label }) =>
                <button
                  className={`bg-hermit-grey-400 border rounded-md px-2
                    ${value === color ? 'border border-hermit-yellow-403' : 'border-hermit-grey-900'}`}
                  key={value} 
                  onClick={() => setColor(value)}>{label}</button>)
            (colors)}
      </div>
      <button
        disabled={!isSelected}
        className='bg-hermit-grey-400 border border-hermit-gray-900 rounded-md px-2'
        onClick={deleteSelectedShape}
      >Delete</button>
      <button
        disabled={!hasHistory}
        className='bg-hermit-grey-400 border border-hermit-gray-900 rounded-md px-2'
        onClick={undo}
      >Undo</button>
    </div>
  )
}

export { Controls }