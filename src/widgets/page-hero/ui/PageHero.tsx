import type { ReactNode } from 'react'
import type { PageHeroStat } from '../model/types'
import styles from './PageHero.module.css'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  stats?: PageHeroStat[]
  statsLabel?: string
  children?: ReactNode
}

export const PageHero = ({
  eyebrow,
  title,
  description,
  stats = [],
  statsLabel,
  children,
}: PageHeroProps) => (
  <header className={styles.hero}>
    <div className={styles.content}>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>

      {stats.length ? (
        <aside className={styles.heroAside} aria-label={statsLabel || 'Краткая информация'}>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div className={styles.statItem} key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      ) : null}
    </div>

    {children}
  </header>
)
