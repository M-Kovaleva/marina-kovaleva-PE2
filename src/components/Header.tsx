import { useState, type KeyboardEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { House, LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'
import type { AuthView } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import buttons from '../styles/buttons.module.css'
import styles from './Header.module.css'

/**
 * Sticky header. Visitor: Log in; Register; List your venue
 * Logged in: Venues; (Venue manager); avatar + name; Log out
 * Phones: a burger button opens the same links as a menu
 */
function Header() {
  const { user, isManager, logout, openAuth } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    closeMenu()
    logout()
    navigate('/')
  }

  function openModal(view: AuthView) {
    closeMenu()
    openAuth(view)
  }

  // Esc closes the phone menu
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') closeMenu()
  }

  const role = isManager ? 'Venue manager' : 'Customer'

  return (
    <header className={styles.header} onKeyDown={handleKeyDown}>
      <div className={styles.bar}>
        <Link to="/" className={styles.home} onClick={closeMenu}>
          <Logo />
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        <nav
          id="main-menu"
          aria-label="Main"
          className={menuOpen ? `${styles.nav} ${styles.open}` : styles.nav}
        >
          {user ? (
            <ul className={styles.list}>
              <li className={`${styles.user} ${styles.phoneOnly}`}>
                <Avatar name={user.name} url={user.avatar?.url} />
                <span>
                  <span className={styles.name}>{user.name}</span>
                  <span className={styles.role}>{role}</span>
                </span>
              </li>
              <li>
                <NavLink to="/" end className={styles.link} onClick={closeMenu}>
                  Venues
                </NavLink>
              </li>
              {isManager && (
                <li className={styles.desktopOnly}>
                  <span className={styles.badge}>Venue manager</span>
                </li>
              )}
              <li className={styles.desktopOnly}>
                <NavLink to="/profile" className={`${styles.link} ${styles.profile}`}>
                  <Avatar name={user.name} url={user.avatar?.url} />
                  {user.name}
                </NavLink>
              </li>
              <li className={styles.phoneOnly}>
                <NavLink to="/profile" className={styles.link} onClick={closeMenu}>
                  My profile
                </NavLink>
              </li>
              <li className={styles.action}>
                <button type="button" className={buttons.secondary} onClick={handleLogout}>
                  <LogOut size={18} aria-hidden="true" className={styles.phoneOnly} />
                  Log out
                </button>
              </li>
            </ul>
          ) : (
            <ul className={styles.list}>
              <li className={styles.phoneOnly}>
                <NavLink to="/" end className={styles.link} onClick={closeMenu}>
                  Venues
                </NavLink>
              </li>
              <li>
                <button type="button" className={styles.link} onClick={() => openModal('login')}>
                  Log in
                </button>
              </li>
              <li>
                <button type="button" className={styles.link} onClick={() => openModal('register')}>
                  Register
                </button>
              </li>
              <li className={styles.action}>
                <button
                  type="button"
                  className={buttons.secondary}
                  onClick={() => openModal('register-manager')}
                >
                  <House size={18} aria-hidden="true" className={styles.phoneOnly} />
                  List your venue
                </button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  )
}

interface AvatarProps {
  name: string
  url?: string
}

/** Round photo, or the first letter of the name when there is no photo */
function Avatar({ name, url }: AvatarProps) {
  if (url) return <img src={url} alt="" className={styles.avatar} />
  return (
    <span className={styles.avatar} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default Header
