import { ROUTES } from '@/shared/config'
import { Link } from 'react-router-dom'
import { programLabel } from '../model/constants'
import type { Program } from '../model/types'
import styles from './ProgramCard.module.css'

interface ProgramCardProps {
  program: Program
  actionLabel?: string
  to?: string
}

export const ProgramCard = ({
  program,
  actionLabel = 'Открыть программу',
  to = `${ROUTES.PROGRAMS}/${program.id}`,
}: ProgramCardProps) => {
  return (
    <Link className={styles.card} to={to}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>{programLabel}</span>
        <span className={styles.chip}>
          {program.user.first_name} {program.user.last_name}
        </span>
      </div>

      <h3 className={styles.title}>{program.title}</h3>
      <p className={styles.description}>{program.description ?? 'Описание пока не добавлено.'}</p>

      <span className={styles.action}>{actionLabel}</span>
    </Link>
  )
}
