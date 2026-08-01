import { courseTypeLabels, type Course } from '@/entities/course'
import {
  progressStatusLabels,
  type CourseProgressItem,
  type ProgressSelectChangePayload,
  type ProgressStatus,
} from '@/entities/progress'
import type { UserPublic } from '@/entities/user'
import { CourseProgressSelect } from '@/features/course-progress-select'
import { formatDate } from '@/shared/lib/formatDate'
import { Button } from '@/shared/ui/Button'
import { CheckCircleOutlined } from '@ant-design/icons'
import styles from './ProgressCourses.module.css'

export type ProgressFilter = 'all' | 'active' | ProgressStatus

interface ProgressCoursesProps {
  activeFilter: ProgressFilter
  courseItems: CourseProgressItem[]
  filteredCourseItems: CourseProgressItem[]
  programTitleById: Map<Course['program_id'], string>
  userId: UserPublic['id']
  onFilterChange: (filter: ProgressFilter) => void
  onProgressChange: (payload: ProgressSelectChangePayload) => void
}

const filterOptions: Array<{ label: string; value: ProgressFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: progressStatusLabels.in_progress, value: 'in_progress' },
  { label: progressStatusLabels.completed, value: 'completed' },
  { label: 'Предстоит', value: 'not_started' },
]

const statusClassNames: Record<ProgressStatus, string> = {
  not_started: styles.statusNotStarted,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
}

export const ProgressCourses = ({
  activeFilter,
  courseItems,
  filteredCourseItems,
  programTitleById,
  userId,
  onFilterChange,
  onProgressChange,
}: ProgressCoursesProps) => {
  const progressByCourseId = new Map(courseItems.map((item) => [item.course.id, item.progress]))

  return (
    <section className={styles.coursesSection} aria-labelledby="progress-courses-title">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Курсы</p>
          <h2 id="progress-courses-title" className={styles.sectionTitle}>
            Статусы по курсам
          </h2>
        </div>
        <p>Можно быстро переключить состояние курса и сразу увидеть, как меняется общая сводка.</p>
      </div>

      <div className={styles.filters} aria-label="Фильтр курсов по прогрессу">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            className={activeFilter === option.value ? styles.activeFilterButton : undefined}
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className={styles.courseList}>
        {filteredCourseItems.map(({ course, progress, status }) => (
          <article className={styles.courseCard} key={course.id}>
            <div className={styles.courseMain}>
              <div className={styles.courseTitleRow}>
                <span className={styles.courseType}>
                  {courseTypeLabels[course.type ?? 'required']}
                </span>
                <span className={`${styles.statusPill} ${statusClassNames[status]}`}>
                  {progressStatusLabels[status]}
                </span>
              </div>

              <h2>{course.title}</h2>
              <p>{course.description || 'Описание курса пока не заполнено.'}</p>

              <dl className={styles.courseMeta}>
                <div>
                  <dt>Программа</dt>
                  <dd>{programTitleById.get(course.program_id) || 'Без программы'}</dd>
                </div>
                <div>
                  <dt>Старт</dt>
                  <dd>{progress?.started_at ? formatDate(progress.started_at) : '—'}</dd>
                </div>
                <div>
                  <dt>Финиш</dt>
                  <dd>{progress?.completed_at ? formatDate(progress.completed_at) : '—'}</dd>
                </div>
              </dl>
            </div>

            <CourseProgressSelect
              className={styles.progressSelect}
              courseId={course.id}
              progress={progressByCourseId.get(course.id) ?? null}
              userId={userId}
              onSelectChange={onProgressChange}
            />
          </article>
        ))}
      </div>

      {!filteredCourseItems.length ? (
        <div className={styles.emptyState}>
          <CheckCircleOutlined />
          <strong>Здесь пока нет курсов</strong>
          <span>Смените фильтр, чтобы увидеть остальные статусы.</span>
        </div>
      ) : null}
    </section>
  )
}
