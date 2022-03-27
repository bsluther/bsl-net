import { useAtom } from 'jotai'
import { map } from 'ramda'
import { HamburgerSvg } from '../../tracker/svg'
import { bslnetNavAtom } from '../atoms'

const PageLink = ({ link, isCurrent, onClick }) => 
  <span
    className={`text-hermit-grey-400 hover:text-hermit-grey-300 capitalize cursor-pointer 
      ${isCurrent && 'underline'}`}
    onClick={onClick}
  >{link}</span>

const DesktopHeader = () => {
  const [navState, setNavState] = useAtom(bslnetNavAtom)

  return (
    <section
      className={`w-full h-8 flex row-start-1 row-span-1 text-hermit-grey-400 bg-hermit-grey-900 items-center justify-center
      space-x-8 sticky`}
    >
      {map(link => 
            <PageLink 
              link={link} 
              key={link} 
              isCurrent={navState.activeLink === link}
              onClick={() => setNavState(prev => ({ ...prev, activeLink: link }))}
            />)
          (navState.links)}
      <HamburgerSvg
        className={`absolute top-1 right-2 w-6 h-6`}
      />
    </section>
  )
}

export { DesktopHeader }