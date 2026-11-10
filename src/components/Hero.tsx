import type { ReactNode } from 'react'
import styles from './Hero.module.css'

interface HeroProps {
  children: ReactNode
}

/**
 * Home page hero: a full-width photo with a white "postcard" frame on top
 * The frame has an open window (the photo shows through) and a white strip
 * with the page title and the search form (passed in as children)
 */
function Hero({ children }: HeroProps) {
  return (
    <section className={styles.hero}>
      <img
        className={styles.photo}
        src="/public/hero-1920.webp"
        srcSet="/public/hero-960.webp 960w, /public/hero-1920.webp 1920w"
        sizes="100vw"
        alt="Red wooden cabin by a fjord in Lofoten, Norway"
        fetchPriority="high"
      />

      <div className={styles.frame}>
        <div className={styles.window} />
        <div className={styles.strip}>
          <h1 className={styles.title}>Find your next stay.</h1>
          {children}
        </div>
      </div>
    </section>
  )
}

export default Hero
