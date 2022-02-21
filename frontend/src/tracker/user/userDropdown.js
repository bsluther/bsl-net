import { map } from 'ramda'
import { loginAtom, logoutAtom } from '../atoms'
import { useAtom } from 'jotai'

const UserDropdown = ({ users, currentUser, handleLogin }) => {
  const [, login] = useAtom(loginAtom)
  const [, logout] = useAtom(logoutAtom)
  return (
    <select
      className={`bg-hermit-grey-400 rounded-sm text-sm outline-hermit-yellow-400 text-center text-hermit-grey-900 w-max`}
      value={currentUser} 
      onChange={e => {
        logout()
        login(e.target.value)
      }}>
      <option value='noCurrentUser'>select a user</option>
      {map(usr =>
        <option key={usr} value={usr}>{usr}</option>)(users)}
    </select>
  )
}

export { UserDropdown }