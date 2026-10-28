import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <Link to="/">Holidaze</Link>
      <nav aria-label="Main">
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  )
}

export default Header
