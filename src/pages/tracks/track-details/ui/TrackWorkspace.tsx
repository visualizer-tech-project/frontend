import { type Course } from '@/entities/course'
import type { CareerTrack } from '@/entities/track'
import { formatDate } from '@/shared/lib/formatDate'
import { PageHero } from '@/widgets/page-hero'
import styles from './TrackWorkspace.module.css'

interface TrackWorkspaceProps {
  track: CareerTrack
  courses: Course[]
}

export const TrackWorkspace = ({ track, courses }: TrackWorkspaceProps) => {
  const createdAt = formatDate(track.created_at) ?? '—'
  const updatedAt = formatDate(track.updated_at) ?? '—'
  const authorName = `${track.user.first_name} ${track.user.last_name}`.trim() || track.user.email

  return (
    <section className={styles.page}>
      <PageHero
        eyebrow={`Трек (ID: ${track.id})`}
        title={track.title}
        description={track.description ?? 'У этого трека пока нет описания.'}
        statsLabel="Информация о треке"
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
            value: authorName,
          },
          {
            label: 'Курсы',
            value: courses.length,
          },
        ]}
      />
    </section>
  )
}
