import { useState } from 'react'
import { ChevronDoubleRight } from '../svg'

const Collapsable = ({ children, ...props }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section
      {...props}
      onClick={() => {
        if(collapsed) {
          setCollapsed(false)
        }
      }}
      className={`h-full flex flex-col
        transition-all ease-in-out duration-500
        ${collapsed ? 'w-12 min-w-[3rem]' : 'w-1/3 min-w-[300px]'}
        bg-hermit-grey-700 border-r-2 border-hermit-grey-900`}
    >
      <div className='basis-full w-full'>
        {collapsed || children}
      </div>
      
      <ChevronDoubleRight
        className={`h-6 w-6 mb-1 mx-2 self-end hover:text-hermit-yellow-403
          transition ease-in-out duration-600 ${collapsed || `-rotate-180`}
        `}
        onClick={() => setCollapsed(prev => !prev)}
      />
    </section>
  )
}

const Layout = () => {
  return (
    <section
      className='w-full h-full flex'
    >
      <Collapsable>
        <section className='w-full'>SIDEBAR</section>
      </Collapsable>
        <section className='w-full'>MAIN</section>
    </section>
  )
}

export { Layout }