import { map } from 'ramda'
import { HamburgerSvg } from '../tracker/svg'
import { useBreakpoint } from '../hooks/useBreakpoint'

const links = ['Tracker', 'Gainzville', 'About']

const PageLink = ({ label, isCurrent, handleClick }) => 
  <span
    className={`text-hermit-grey-400`}
  >{label}</span>

const DesktopHeader = ({ activeAppName }) => {

  return (
    <section
      className={` flex row-start-1 row-span-1 text-hermit-grey-400 bg-hermit-grey-900 items-center justify-center
      space-x-8 sticky`}
    >
      {map(label => 
            <PageLink label={label} key={label} />)
          (links)}
      <HamburgerSvg
        className={`absolute top-1 right-2 w-6 h-6`}
      />
    </section>
  )
}

const MobileHeader = ({ activeAppName }) => {

  return (
    <div className='relative'>
      <section
        className={`flex text-hermit-grey-400 bg-hermit-grey-900 items-center justify-center h-8 overflow-hidden fixed w-full`}
      >
        <div className={`h-max`}
        >
          {activeAppName}
        </div>
        <HamburgerSvg
          className={`absolute top-1 right-2 w-6 h-6`}
        />
      </section>
    </div>
  )
}

const Header = ({ activeAppName = 'Tracker' }) => {
  const breakpoint = useBreakpoint()

  if (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') {
    return <MobileHeader activeAppName={activeAppName} />
  }
  return (
    <DesktopHeader activeAppName={activeAppName} />
  )
}

export { Header, MobileHeader, DesktopHeader }
