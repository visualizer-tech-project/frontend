import { ROUTES } from '@/shared/config'
import { formatDate } from '@/shared/lib/formatDate'
import { Link } from 'react-router-dom'
import { mockPrograms } from '../model/mockPrograms'
import type { Program } from '../model/types'
import styles from './ProgramCard.module.css'

interface ProgramCardProps {
  programId: Program['id']
  actionLabel?: string
}

export const ProgramCard = ({ actionLabel, programId }: ProgramCardProps) => {
  const program = mockPrograms.find(({ id }) => id === programId)

  if (!program) {
    return null
  }

  const authorName = `${program.user.first_name} ${program.user.last_name}`.trim()

  return (
    <Link className={styles.card} to={`${ROUTES.PROGRAMS}/${programId}`}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>
          Автор: {`${authorName || program.user.email} (ID: ${program.user_id})`}
        </span>
      </div>

      <h3 className={styles.title}>{program.title}</h3>

      <p className={styles.description}>{program.description ?? 'Описание пока не добавлено.'}</p>

      <div className={styles.footer}>
        <p className={styles.date}>
          Создано: <span>{formatDate(program.created_at)}</span>
        </p>

        <p className={styles.date}>
          Обновлено: <span>{formatDate(program.updated_at)}</span>
        </p>
      </div>

      <span className={styles.action}>{actionLabel || 'Открыть программу'}</span>
    </Link>
  )
}
