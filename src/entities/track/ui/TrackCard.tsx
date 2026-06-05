import { ROUTES } from '@/shared/config'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { CareerTrack } from '../model/types'
import styles from './TrackCard.module.css'

interface TracksGridProps {
  track: CareerTrack
  actionLabel?: string
  children?: ReactNode
}

export const TrackCard = ({
  track,
  actionLabel = 'Подробнее',
  children,
}: TracksGridProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>Трек</span>
        <span className={styles.chip}>{track.courses_count} курсов</span>
      </div>
      <h3 className={styles.title}>{track.title}</h3>
      <p className={styles.description}>{track.description ?? 'Описание пока не добавлено.'}</p>
      <div className={styles.footer}>
        <Link className={styles.action} to={`${ROUTES.TRACKS}/${track.id}`}>
          {actionLabel}
        </Link>
        {children}
      </div>
    </article>
  )
}
