import type { Program } from '@/entities/program'
import { formatDate } from '@/shared/lib/formatDate'
import { PageHero } from '@/widgets/page-hero'
import styles from './ProgramWorkspace.module.css'

interface ProgramWorkspaceProps {
  program: Program
}

export const ProgramWorkspace = ({ program }: ProgramWorkspaceProps) => {
  const createdAt = program.created_at ? formatDate(program.created_at) : '—'
  const updatedAt = program.updated_at ? formatDate(program.updated_at) : '—'

  return (
    <section className={styles.page}>
      <PageHero
        eyebrow={`Программа (ID: ${program.id})`}
        title={program.title}
        description={program.description ?? 'У этой программы пока нет описания.'}
        statsLabel="Информация о программе"
        stats={[
          {
            label: 'Дата создания',
            value: createdAt,
          },
          {
            label: 'Обновлено',
            value: updatedAt,
          },
          {
            label: 'Автор',
            value:
              `${program.user.first_name} ${program.user.last_name}`.trim() || program.user.email,
          },
        ]}
      />
    </section>
  )
}
