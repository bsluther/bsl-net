import { useBreakpoint } from '../hooks/useBreakpoint'
import { DesktopApp } from './DesktopApp'
import { MobileApp } from './MobileApp'


const BreakpointSwitch = () => {
  const breakpoint = useBreakpoint()
  
  if (breakpoint === 'xs' || breakpoint === 'sm' || true) {
    return <MobileApp />
  }
  
  return (
    <DesktopApp />
    )
  }
  
  export { BreakpointSwitch }