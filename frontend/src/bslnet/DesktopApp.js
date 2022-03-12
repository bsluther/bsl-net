import { DesktopHeader } from './Header'

const DesktopApp = () => {
  return (
    <section
      className={`font-customMono h-screen w-screen grid grid-rows-mainHeader grid-cols-1`}
    >
      <DesktopHeader />
      <div>
        Desktop breakpoint app....
      </div>
    </section>
  )
}

export { DesktopApp }