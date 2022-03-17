import { useAtom } from 'jotai'
import { SubMenuToggle } from './header'
import { trackerAtom } from '../atoms'
import * as L from 'partial.lenses'

const TrackerSubMenu = () => {
  const [trackerState, setTrackerState] = useAtom(trackerAtom)

  const toggleWindow = windowName =>
    setTrackerState(L.modify(['windows', windowName])
                            (x => !x)
                            (trackerState))

  return (
    <>
      <SubMenuToggle label={'Block Editor'} isOpen={trackerState.windows.blockEditor} handleToggle={() => toggleWindow('blockEditor')} />
      <SubMenuToggle label={'Category Editor'} isOpen={trackerState.windows.categoryEditor} handleToggle={() => toggleWindow('categoryEditor')} />
      <SubMenuToggle label={'Block Matrix'} isOpen={trackerState.windows.blockMatrix} handleToggle={() => toggleWindow('blockMatrix')} />
      <SubMenuToggle label={'Tranche Matrix'} isOpen={trackerState.windows.trancheMatrix} handleToggle={() => toggleWindow('trancheMatrix')} />
    </>
  )
}

export { TrackerSubMenu }