import { map } from 'ramda'

const UserDropdown = ({ users, currentUser, handleLogin }) => {
  return (
    <select
      className={`bg-hermit-grey-400 rounded-sm text-sm outline-hermit-yellow-400 text-center text-hermit-grey-900 w-max`}
      value={currentUser} 
      onChange={e => handleLogin(e.target.value)}>
      <option value='noCurrentUser'>select a user</option>
      {map(usr =>
        <option key={usr} value={usr}>{usr}</option>)(users)}
    </select>
  )
}

export { UserDropdown }