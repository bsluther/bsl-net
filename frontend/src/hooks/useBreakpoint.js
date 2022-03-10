import { pipe } from 'sanctuary'
import { reduceWhile, map, filter } from 'ramda'
import { useEffect, useState } from 'react'

const breakpointWidths = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536 
}

const breakpoints = [640, 768, 1024, 1280, 1536]

const breakpointHash = {
  640: 'sm',
  768: 'md',
  1024: 'lg',
  1280: 'xl',
  1536: '2xl'
}

const filterBreakpoints = currentWidth => filter(brkPt => brkPt < currentWidth)(breakpoints)

const chooseBreakpoint = arr =>
  arr.length === 0
    ? 'xs'
    : breakpointHash[Math.max(...arr)]

const calcBreakpoint = pipe([
  filterBreakpoints,
  chooseBreakpoint
])
             

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => calcBreakpoint(document.documentElement.clientWidth))

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = document.documentElement.clientWidth
      const newBreakpoint = calcBreakpoint(currentWidth)
      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  return breakpoint
}

export { useBreakpoint }