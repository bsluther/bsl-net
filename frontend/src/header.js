import { atom, useAtom } from 'jotai'
import { map } from 'ramda'
import * as L from 'partial.lenses'
import { UserDropdown } from './tracker/user/userDropdown'
import { useLayoutEffect, useRef, useState } from 'react'

const headerNavAtom = atom({ activeLink: null })

const HeaderSubMenu = ({ navState, setNavState, userAtom }) => {
  const [userState, setUserState] = useAtom(userAtom)
  const [buttonHeight, setButtonHeight] = useState()
  const buttonRef = useRef()

  useLayoutEffect(() => {
    setButtonHeight(buttonRef.current.offsetHeight)
  }, [buttonRef, setButtonHeight])

  return (
    <div
      className={`bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
        w-4/5 h-7 flex place-items-center justify-end
        ${navState.activeLink ? 'scale-x-100' : 'scale-x-0'}
        transition-transform ease-in-out duration-1000`}>
      <UserDropdown 
        users={userState.users}
        currentUser={userState.currentUser}
        handleLogin={usr => setUserState(L.set(['currentUser'], usr))}
        height={buttonHeight}
      />
      <button
        className={`text-xs border bg-hermit-grey-400 text-hermit-grey-900 border-hermit-grey-400 justify-self-end mx-2 rounded-sm px-1`}
        onClick={() => setNavState(L.set(['activeLink'], 'noCurrentUser'))}
        ref={buttonRef}
      >EXIT</button>
    </div>
  )
}

const NavButton = ({ text, active, handleClick }) => {
  return (
    <div className='flex flex-col w-max h-max'>
      <div
        className={`text-hermit-grey-400 underline`}
        onClick={handleClick}>{text}</div>
    </div>
  )
}

const HeaderMenu = ({ navState, setActiveLink }) => {
  
  return (
      <div className={`flex space-x-8 w-full place-content-center`}>
        {map(text => 
              <NavButton
                key={text} 
                text={text} 
                handleClick={() => setActiveLink(text)} />)
            (['Tracker', 'Gainzville', 'Glossary', 'Writing'])}
      </div>
      

  )
}

const Header = ({ userAtom }) => {
  const [navState, setNavState] = useAtom(headerNavAtom)
  console.log(navState)

  return (
    <section className={`
      flex flex-col row-start-1 row-end-2 col-start-1 col-end-3 w-full
      place-items-center justify-evenly
      border-black bg-hermit-grey-900 mb-2`}>
      <div className='text-hermit-grey-200 fixed top-1 right-3'>BSL</div>
      <HeaderMenu navState={navState} setActiveLink={name => setNavState(L.set(['activeLink'], name))}/>
      <HeaderSubMenu navState={navState} setNavState={setNavState} userAtom={userAtom}/>
    </section>
  )
}

export { Header }