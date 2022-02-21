import { atom, useAtom } from 'jotai'
import { map } from 'ramda'
import * as L from 'partial.lenses'
import { UserDropdown } from './tracker/user/userDropdown'
import { useLayoutEffect, useRef, useState } from 'react'
import { logoutAtom } from './tracker/atoms'

const headerNavAtom = atom({ activeLink: 'Tracker' })

const HeaderSubMenu = ({ navState, setNavState, userAtom }) => {
  const [userState, setUserState] = useAtom(userAtom)
  const [buttonHeight, setButtonHeight] = useState()
  const buttonRef = useRef()
  const [, logout] = useAtom(logoutAtom)

  useLayoutEffect(() => {
    setButtonHeight(buttonRef.current.offsetHeight)
  }, [buttonRef, setButtonHeight])

  return (
    <div
      className={`bg-hermit-grey-900 border border-hermit-grey-400 rounded-md
        w-4/5 h-7 flex place-items-center justify-end space-x-6 px-2
        ${navState.activeLink ? 'scale-x-100' : 'scale-x-0'}
        transition-transform ease-in-out duration-1000`}>
      <UserDropdown 
        users={userState.users}
        currentUser={userState.currentUser}
        handleLogin={usr => setUserState(L.set(['currentUser'], usr))}
      />
      <button
        className={`text-xs border bg-hermit-grey-400 text-hermit-grey-900 border-hermit-grey-400 justify-self-end rounded-sm px-1`}
        onClick={logout}
        // onClick={() => setUserState(L.set(['currentUser'], 'noCurrentUser'))}
        ref={buttonRef}
      >LOGOUT</button>
    </div>
  )
}

const NavButton = ({ text, handleClick, isCurrent }) => {
  return (
    <button
      className={`text-hermit-grey-400 underline`}
      onClick={handleClick}
    >{text}</button>
  )
}

const HeaderMenu = ({ activeLink, setActiveLink }) => {
  
  return (
      <div className={`flex space-x-8 w-full place-content-center`}>
        {map(text => 
              <NavButton
                isCurrent={activeLink === text}
                key={text} 
                text={text} 
                handleClick={() => setActiveLink(text)} />)
            (['Home', 'Tracker', 'Gainzville', 'Glossary', 'Writing'])}
      </div>
      

  )
}

const Header = ({ userAtom }) => {
  const [navState, setNavState] = useAtom(headerNavAtom)

  return (
    <section className={`
      flex flex-col row-start-1 row-end-2 col-start-1 col-end-3 w-full
      place-items-center justify-evenly
      border-black bg-hermit-grey-900 mb-2`}>
      <div className='text-hermit-grey-200 fixed top-1 right-3'>BSL</div>
      <HeaderMenu activeLink={navState.activeLink} setActiveLink={name => setNavState(L.set(['activeLink'], name))}/>
      <HeaderSubMenu navState={navState} setNavState={setNavState} userAtom={userAtom}/>
    </section>
  )
}

export { Header }