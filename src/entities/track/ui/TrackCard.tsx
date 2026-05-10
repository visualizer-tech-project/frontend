import { type CareerTrack } from '@/entities/track'
import { Link } from 'react-router-dom'
import styles from '../../program/ui/ProgramCard.module.css'

interface TracksGridProps {
  track: CareerTrack
  actionLabel?: string
}

export const TrackCard = ({ track, actionLabel = 'Подробнее' }: TracksGridProps) => {
  return (
    <Link className={styles.card} to={`/tracks/${track.id}`}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>Трек</span>
        <span className={styles.chip}>{track.courses_count} курсов</span>
      </div>
      <h3 className={styles.title}>{track.title}</h3>
      <p className={styles.description}>{track.description ?? 'Описание пока не добавлено.'}</p>
      <div className={styles.footer}>
        <span className={styles.action}>{actionLabel}</span>
      </div>
    </Link>
  )
}
