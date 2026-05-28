import type { CourseProgressItem } from '@/entities/progress'
import { CheckCircleOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import styles from './ProgressFocus.module.css'

interface ProgressFocusProps {
  completedItems: CourseProgressItem[]
  inProgressItems: CourseProgressItem[]
  notStartedItems: CourseProgressItem[]
}

export const ProgressFocus = ({
  completedItems,
  inProgressItems,
  notStartedItems,
}: ProgressFocusProps) => (
  <section className={styles.focusSection} aria-label="Быстрый фокус">
    <article>
      <ClockCircleOutlined />
      <span>В работе</span>
      <strong>{inProgressItems[0]?.course.title || 'Нет активного курса'}</strong>
    </article>
    <article>
      <CheckCircleOutlined />
      <span>Последний закрытый</span>
      <strong>{completedItems[0]?.course.title || 'Пока нет завершенных курсов'}</strong>
    </article>
    <article>
      <PlayCircleOutlined />
      <span>Следующий шаг</span>
      <strong>{notStartedItems[0]?.course.title || 'Все курсы уже активны'}</strong>
    </article>
  </section>
)
