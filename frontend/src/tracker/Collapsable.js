import { useState } from 'react'
import { ChevronDown, ChevronLeft } from './svg'


const Collapsable = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div>
        <div
          className={`w-full flex px-2 items-center
            bg-hermit-grey-900 text-hermit-grey-400 
          `}
        >
          <span className={`py-1 uppercase grow`}>{title}</span>
          {
            isCollapsed
              ? <ChevronLeft
                  className={`w-6 h-6 hover:text-hermit-yellow-403`}
                  onClick={() => setIsCollapsed(false)}
                />
              : <ChevronDown
                  className={`w-6 h-6 hover:text-hermit-yellow-403`}
                  onClick={() => setIsCollapsed(true)}
                 />
        }
        </div>
      
      {isCollapsed || children}
    </div>
    
  )
}

export { Collapsable }