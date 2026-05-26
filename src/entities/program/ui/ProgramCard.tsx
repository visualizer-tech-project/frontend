import { ROUTES } from '@/shared/config'
import { formatDate } from '@/shared/lib/formatDate'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { programLabel } from '../model/constants'
import type { Program } from '../model/types'
import styles from './ProgramCard.module.css'

interface ProgramCardProps {
  program: Program
  actionLabel?: string
  to?: string
  children?: ReactNode
}

export const ProgramCard = ({
  program,
  actionLabel = 'Открыть программу',
  to = `${ROUTES.PROGRAMS}/${program.id}`,
  children,
}: ProgramCardProps) => {
  const authorName = `${program.user.first_name} ${program.user.last_name}`.trim()

  return (
    <article className={styles.card}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>{programLabel}</span>

        <span className={styles.chip}>
          Автор: {authorName || program.user.email} (ID: {program.user_id})
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

        <div className={styles.actions}>
          <Link className={styles.action} to={to}>
            {actionLabel}
          </Link>

          {children}
        </div>
      </div>
    </article>
  )
}
