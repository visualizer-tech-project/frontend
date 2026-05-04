import clsx from 'clsx'
import type { Program } from '../model/types'
import styles from './ProgramsGrid.module.css'

interface ProgramsGridProps {
  programs: Program[]
  actionLabel?: string
  className?: string
  emptyTitle?: string
  emptyDescription?: string
  onAction?: (program: Program) => void
}

export const ProgramsGrid = ({
  programs,
  actionLabel = 'Подробнее',
  className,
  emptyTitle = 'Ничего не найдено',
  emptyDescription = 'Попробуй изменить запрос или открыть весь каталог.',
  onAction,
}: ProgramsGridProps) => {
  if (!programs.length) {
    return (
      <div className={clsx(styles.emptyState, className)}>
        <h3>{emptyTitle}</h3>
        <p>{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className={clsx(styles.grid, className)}>
      {programs.map((program) => (
        <article key={program.id} className={styles.card}>
          <div className={styles.metaRow}>
            <span className={styles.chip}>{program.level}</span>
            <span className={styles.chip}>{program.duration}</span>
          </div>

          <h3 className={styles.title}>{program.title}</h3>
          <p className={styles.description}>{program.description}</p>

          {onAction ? (
            <button className={styles.action} type="button" onClick={() => onAction(program)}>
              {actionLabel}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  )
}
