import { ROUTES } from '@/shared/config'
import { Link } from 'react-router-dom'
import { studyModeLabels } from '../model/constants'
import { mockPrograms } from '../model/mockPrograms'
import type { Program } from '../model/types'
import styles from './ProgramCard.module.css'

interface ProgramCardProps {
  programId: Program['id']
  actionLabel?: string
}

export const ProgramCard = ({ actionLabel = 'Открыть программу', programId }: ProgramCardProps) => {
  const program = mockPrograms.find(({ id }) => id === programId)

  if (!program) {
    return null
  }

  return (
    <Link className={styles.card} to={`${ROUTES.PROGRAMS}/${programId}`}>
      <div className={styles.metaRow}>
        <span className={styles.chip}>{studyModeLabels[program.study_mode]}</span>
        <span className={styles.chip}>{program.admission_year} год набора</span>
      </div>

      <h3 className={styles.title}>{program.title}</h3>
      <p className={styles.description}>{program.description ?? 'Описание пока не добавлено.'}</p>

      <span className={styles.action}>{actionLabel}</span>
    </Link>
  )
}
