import { ProgramCard, type Program } from '@/entities/program'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './ProgramsList.module.css'

interface IProgramsList {
  programs: Program[]
  actionLabel?: string
  className?: string
}

export const ProgramsList: FC<IProgramsList> = ({ programs, actionLabel, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      {programs.length ? (
        <div className={styles.grid}>
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              actionLabel={actionLabel || 'Подробнее'}
              programId={program.id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>Ничего не найдено</h3>
          <p>Измените поиск, формат обучения или год набора, чтобы увидеть подходящие программы.</p>
        </div>
      )}
    </div>
  )
}
