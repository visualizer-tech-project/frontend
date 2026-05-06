import { mockPrograms } from '@/entities/program'
import { ProgramsGrid } from '@/widgets/programs'
import styles from './HomeProgramsWidget.module.css'

interface HomeProgramsWidgetProps {
  onBack: () => void
}

export const HomeProgramsWidget = ({ onBack }: HomeProgramsWidgetProps) => (
  <div className={styles.root}>
    <ProgramsGrid backLabel="Назад" onBack={onBack} programs={mockPrograms} surface="transparent" />
  </div>
)
