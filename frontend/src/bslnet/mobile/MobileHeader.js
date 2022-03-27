import { useAtom } from 'jotai'
import { HamburgerSvg } from '../../tracker/svg'
import { bslnetNavAtom } from '../atoms'

const MobileHeader = () => {
  const [navState] = useAtom(bslnetNavAtom)

  return (
    <div className='relative'>
      <section
        className={`flex text-hermit-grey-400 bg-hermit-grey-900 items-center justify-center h-8 overflow-hidden fixed w-full`}
      >
        <span className={`h-max capitalize`}
        >
          {navState.activeLink}
        </span>
        <HamburgerSvg
          className={`absolute top-1 right-2 w-6 h-6`}
        />
      </section>
    </div>
  )
}

export { MobileHeader }