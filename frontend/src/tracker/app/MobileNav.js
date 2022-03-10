import { map } from 'ramda'
import { PlusCircleSvg, MinusCircleSvg, CollectionSvg, CubeTransparentSvg, TableSvg } from '../svg'

const NavButton = ({ label, Icon }) => {
  return (
    <div className={`flex flex-col items-center`}>
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

const MobileNav = () => {
  return (
    <section
      className={`flex w-full justify-around pt-1
        bg-hermit-grey-400 border-t border-hermit-grey-900
      `}
    >
      {
        map(lbl =>
              <NavButton label={lbl} Icon={iconHash[lbl]} key={lbl} />
        )
           (navLabels)
      }
    </section>
  )
}

export { MobileNav }