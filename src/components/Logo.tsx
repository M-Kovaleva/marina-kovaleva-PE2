import logoMark from '../assets/logo-mark.svg'
import styles from './Logo.module.css'

/** Holidaze mark + the name. The mark is decorative, the name is the text */
function Logo() {
  return (
    <span className={styles.logo}>
      <img src={logoMark} alt="" className={styles.mark} />
      holidaze
    </span>
  )
}

export default Logo
