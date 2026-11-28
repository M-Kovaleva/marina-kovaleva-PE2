import { useRef, useState, type KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, Plus, User, X } from 'lucide-react'
import Logo from './Logo'
import type { AuthView } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import buttons from '../styles/buttons.module.css'
import styles from './Header.module.css'
import Avatar from './Avatar'

/**
 * Sticky header.
 * Visitor: Log in, Register, Create venue (phone: Log in + burger menu).
 * Logged in: + Create venue (managers: the create form, not on the profile page;
 * customers: register a separate venue manager account), avatar that opens the account menu
 */
function Header() {
  const { user, isManager, logout, openAuth } = useAuth()
  const { pathname } = useLocation()
  // The manager's profile page has its own Create venue button, so the header does not repeat it
  const showCreate = !isManager || pathname !== '/profile'
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const accountMenu = useRef<HTMLDivElement>(null)

  const closeMenu = () => setMenuOpen(false)

  // The account menu is a native popover: it closes itself on Esc and on a click outside,
  // but a click on a link inside does not close it, so we do it here
  function closeAccountMenu() {
    accountMenu.current?.hidePopover()
  }

  function handleLogout() {
    closeAccountMenu()
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

  return (
    <header className={styles.header} onKeyDown={handleKeyDown}>
      <div className={styles.bar}>
        <Link
          to="/"
          className={styles.home}
          onClick={() => {
            closeMenu()
            window.scrollTo(0, 0)
          }}
        >
          <Logo />
        </Link>

        {user ? (
          <div className={styles.actions}>
            {showCreate &&
              (isManager ? (
                // Opens the Create venue form on the profile page
                <Link
                  to="/profile?new=venue"
                  className={`${buttons.secondary} ${styles.desktopOnly}`}
                >
                  <Plus size={18} aria-hidden="true" />
                  Create venue
                </Link>
              ) : (
                // Customers can't create venues: venue managers have a separate account
                <button
                  type="button"
                  className={`${buttons.secondary} ${styles.desktopOnly}`}
                  onClick={() => openAuth('register-manager')}
                >
                  <Plus size={18} aria-hidden="true" />
                  Create venue
                </button>
              ))}

            <button
              type="button"
              className={styles.account}
              popoverTarget="account-menu"
              aria-label={`Account menu for ${user.name}`}
            >
              <Menu size={20} aria-hidden="true" className={styles.phoneOnly} />
              <Avatar name={user.name} url={user.avatar?.url} />
              <span className={`${styles.accountName} ${styles.desktopOnly}`}>{user.name}</span>
              <ChevronDown size={16} aria-hidden="true" className={styles.desktopOnly} />
            </button>

            <div id="account-menu" ref={accountMenu} popover="auto" className={styles.menu}>
              <p className={styles.menuName}>{user.name}</p>
              <p className={styles.menuRole}>{isManager ? 'Venue manager' : 'Customer'}</p>
              <ul className={styles.menuList}>
                <li>
                  <Link to="/profile" className={styles.menuItem} onClick={closeAccountMenu}>
                    <User size={18} aria-hidden="true" />
                    My profile
                  </Link>
                </li>
                <li className={styles.menuSeparated}>
                  <button type="button" className={styles.menuItem} onClick={handleLogout}>
                    <LogOut size={18} aria-hidden="true" />
                    Log out
                  </button>
                </li>
                {showCreate && (
                  <li className={`${styles.menuAction} ${styles.phoneOnly}`}>
                    {isManager ? (
                      <Link
                        to="/profile?new=venue"
                        className={`${buttons.secondary} ${styles.menuButton}`}
                        onClick={closeAccountMenu}
                      >
                        <Plus size={18} aria-hidden="true" />
                        Create venue
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`${buttons.secondary} ${styles.menuButton}`}
                        onClick={() => {
                          closeAccountMenu()
                          openAuth('register-manager')
                        }}
                      >
                        <Plus size={18} aria-hidden="true" />
                        Create venue
                      </button>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            <button type="button" className={styles.link} onClick={() => openModal('login')}>
              Log in
            </button>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-controls="visitor-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>

            <nav
              id="visitor-menu"
              aria-label="Main"
              className={menuOpen ? `${styles.nav} ${styles.open}` : styles.nav}
            >
              <button type="button" className={styles.link} onClick={() => openModal('register')}>
                Register
              </button>
              <button
                type="button"
                className={buttons.secondary}
                onClick={() => openModal('register-manager')}
              >
                <Plus size={18} aria-hidden="true" />
                Create venue
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
