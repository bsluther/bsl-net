import { atom, useAtom } from 'jotai'
import { map } from 'ramda'
import { useLayoutEffect, useRef } from 'react'
import { PlusCircleSvg, CollectionSvg, CubeTransparentSvg, TableSvg } from '../svg'

const mobileNavHeightAtom = atom(0)

const NavButton = ({ label, Icon, onClick }) => {
  return (
    <div className={`flex flex-col items-center`} onClick={onClick} >
      <Icon className={`w-6 h-6`} />
      <span className={`text-sm`}>{label}</span>
    </div>
  )
}

const navLabels = ['create', 'history', 'analyze', 'categories']
const iconHash = {
  'create': PlusCircleSvg,
  'history': CollectionSvg,
  'categories': CubeTransparentSvg,
  'analyze': TableSvg
}

const MobileNav = ({ handleNavClick }) => {
  const [,setMobileNavHeight] = useAtom(mobileNavHeightAtom)
  const navRef = useRef()

  useLayoutEffect(() => {
    setMobileNavHeight(navRef.current.offsetHeight)
  }, [navRef, setMobileNavHeight])

  return (
    <section
      className={`
        fixed bottom-0 left-0
        w-full h-12
        flex justify-around pt-1
        bg-hermit-grey-400 border-t border-hermit-grey-900
      `} 
      ref={navRef}
    >
      {
        map(lbl =>
              <NavButton label={lbl} Icon={iconHash[lbl]} onClick={() => handleNavClick(lbl)} key={lbl} />
        )
           (navLabels)
      }
    </section>
  )
}

export { MobileNav, mobileNavHeightAtom }