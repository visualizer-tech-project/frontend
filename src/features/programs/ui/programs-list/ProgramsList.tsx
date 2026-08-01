import { ProgramCard, type Program } from '@/entities/program'
import { DeleteProgramButton } from '@/features/program-delete'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './ProgramsList.module.css'

interface IProgramsList {
  programs: Program[]
  actionLabel?: string
  className?: string
  isLoading?: boolean
}

export const ProgramsList: FC<IProgramsList> = ({
  programs,
  actionLabel,
  className,
  isLoading = false,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {isLoading ? (
        <div className={styles.emptyState} aria-busy="true">
          <h3>Загружаем программы</h3>
          <p>Список появится сразу после ответа сервера.</p>
        </div>
      ) : programs.length ? (
        <div className={styles.grid}>
          {programs.map((program) => (
            <ProgramCard key={program.id} actionLabel={actionLabel || 'Подробнее'} program={program}>
              <DeleteProgramButton program={program} />
            </ProgramCard>
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
