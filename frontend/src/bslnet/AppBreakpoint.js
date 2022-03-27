import { useBreakpoint } from '../hooks/useBreakpoint'
import { DesktopApp } from './desktop/DesktopApp'
import { MobileApp } from './mobile/MobileApp'


const AppBreakpoint = () => {
  const breakpoint = useBreakpoint({ responsive: false })
  
  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return <MobileApp />
  }
  
  return (
    <DesktopApp />
    )
  }
  
  export { AppBreakpoint }