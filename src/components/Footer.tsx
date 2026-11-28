import { Link } from 'react-router-dom'
import Logo from './Logo'
import styles from './Footer.module.css'

/** Bottom of every page: logo (link to the home page) and copyright */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bar}>
        <Link to="/" className={styles.home} onClick={() => window.scrollTo(0, 0)}>
          <Logo />
        </Link>
        <p className={styles.copyright}>© {new Date().getFullYear()} Holidaze</p>
      </div>
    </footer>
  )
}

export default Footer
