import styles from './HomePage.module.css'
import { HomeContent } from './programs/HomeContent'

export const MainContent = () => {
  return (
    <section className={styles.mainContent}>
      <HomeContent />
    </section>
  )
}
