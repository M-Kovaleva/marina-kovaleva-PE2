import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Header() {
  const { user, logout, openAuth } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header>
      <Link to="/">Holidaze</Link>
      <nav aria-label="Main">
        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <button type="button" onClick={() => openAuth('login')}>
            Log in
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
