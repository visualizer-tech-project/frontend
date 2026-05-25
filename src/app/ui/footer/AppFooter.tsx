import styles from './AppFooter.module.css'

export const AppFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>Edu Map</span>
        <span>Карта образовательных программ</span>
      </div>
    </footer>
  )
}
