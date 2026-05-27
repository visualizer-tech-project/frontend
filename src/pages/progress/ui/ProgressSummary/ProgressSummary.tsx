import type { CourseProgressItem } from '@/entities/progress'
import styles from './ProgressSummary.module.css'

interface ProgressSummaryProps {
  activeItems: CourseProgressItem[]
  completedItems: CourseProgressItem[]
  inProgressItems: CourseProgressItem[]
  notStartedItems: CourseProgressItem[]
}

export const ProgressSummary = ({
  activeItems,
  completedItems,
  inProgressItems,
  notStartedItems,
}: ProgressSummaryProps) => (
  <section className={styles.summaryGrid} aria-label="Сводка прогресса">
    <article className={styles.summaryCard}>
      <span>Активные</span>
      <strong>{activeItems.length}</strong>
      <p>Курсы, которые уже начаты или завершены.</p>
    </article>
    <article className={styles.summaryCard}>
      <span>В процессе</span>
      <strong>{inProgressItems.length}</strong>
      <p>Курсы, к которым стоит вернуться в первую очередь.</p>
    </article>
    <article className={styles.summaryCard}>
      <span>Пройдено</span>
      <strong>{completedItems.length}</strong>
      <p>Закрытые курсы с сохраненным результатом.</p>
    </article>
    <article className={styles.summaryCard}>
      <span>Предстоит</span>
      <strong>{notStartedItems.length}</strong>
      <p>Курсы без активной записи прогресса.</p>
    </article>
  </section>
)
