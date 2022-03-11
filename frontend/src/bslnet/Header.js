import { map } from 'ramda'
import { useLayoutEffect } from 'react'
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
    <section
      className={`flex row-start-1 row-span-1 text-hermit-grey-400 bg-hermit-grey-900 items-center justify-center sticky`}
    >
      <div className={`h-max`}
      >
        {activeAppName}
      </div>
      <HamburgerSvg
        className={`absolute top-1 right-2 w-6 h-6`}
      />
    </section>
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

export { Header }
