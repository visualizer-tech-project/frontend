import type { CourseProgressItem } from '@/entities/progress'
import { Progress } from 'antd'
import styles from './ProgressAnalytics.module.css'

interface ProgressAnalyticsProps {
  completedItems: CourseProgressItem[]
  inProgressItems: CourseProgressItem[]
  notStartedItems: CourseProgressItem[]
  totalCourses: number
}

const getPercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0)

export const ProgressAnalytics = ({
  completedItems,
  inProgressItems,
  notStartedItems,
  totalCourses,
}: ProgressAnalyticsProps) => {
  const completedPercent = getPercent(completedItems.length, totalCourses)
  const inProgressPercent = getPercent(inProgressItems.length, totalCourses)
  const notStartedPercent = getPercent(notStartedItems.length, totalCourses)
  const allItems = [...completedItems, ...inProgressItems, ...notStartedItems]
  const requiredItems = allItems.filter((item) => item.course.type === 'required')
  const electiveItems = allItems.filter((item) => item.course.type === 'elective')
  const requiredCompletedPercent = getPercent(
    requiredItems.filter((item) => item.status === 'completed').length,
    requiredItems.length,
  )
  const electiveCompletedPercent = getPercent(
    electiveItems.filter((item) => item.status === 'completed').length,
    electiveItems.length,
  )
  return (
    <section className={styles.analytics} aria-labelledby="progress-analytics-title">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Аналитика</p>
          <h2 id="progress-analytics-title" className={styles.sectionTitle}>
            Картина прохождения
          </h2>
        </div>
        <p>
          Данные собраны по вашему прогрессу на нашем сайте, здесь можете отслеживать ваш прогресс и
          анализировать достижения
        </p>
      </div>

      <div className={styles.analyticsGrid}>
        <article className={styles.progressRingPanel}>
          <Progress
            className={styles.ringChart}
            format={(percent) => <span className={styles.ringValue}>{percent}%</span>}
            percent={completedPercent}
            strokeColor="var(--color-success)"
            railColor="rgb(255 255 255 / 18%)"
            width={200}
            strokeWidth={10}
            type="circle"
          />

          <div className={styles.chartLegend}>
            <span className={styles.legendCompleted}>Пройдено {completedPercent}%</span>
            <span className={styles.legendInProgress}>В процессе {inProgressPercent}%</span>
            <span className={styles.legendNotStarted}>Предстоит {notStartedPercent}%</span>
          </div>
        </article>

        <article className={styles.distributionPanel}>
          <div className={styles.distributionHeader}>
            <span>Распределение</span>
            <strong>{totalCourses} курсов</strong>
          </div>

          <div className={styles.statusBars}>
            <div className={styles.statusBarRow}>
              <span>Пройдено</span>
              <Progress
                percent={completedPercent}
                showInfo={false}
                strokeColor="var(--color-success)"
                trailColor="rgb(255 255 255 / 12%)"
              />
            </div>
            <div className={styles.statusBarRow}>
              <span>В процессе</span>
              <Progress
                percent={inProgressPercent}
                showInfo={false}
                strokeColor="var(--color-warning)"
                trailColor="rgb(255 255 255 / 12%)"
              />
            </div>
            <div className={styles.statusBarRow}>
              <span>Предстоит</span>
              <Progress
                percent={notStartedPercent}
                showInfo={false}
                strokeColor="rgb(245 247 251 / 44%)"
                trailColor="rgb(255 255 255 / 12%)"
              />
            </div>
          </div>

          <div className={styles.typeStats}>
            <div>
              <span>Обязательные</span>
              <strong>{requiredCompletedPercent}%</strong>
              <Progress
                percent={requiredCompletedPercent}
                showInfo={false}
                strokeColor="var(--color-accent-blue)"
                trailColor="rgb(255 255 255 / 10%)"
              />
            </div>
            <div>
              <span>Элективные</span>
              <strong>{electiveCompletedPercent}%</strong>
              <Progress
                percent={electiveCompletedPercent}
                showInfo={false}
                strokeColor="var(--color-accent-blue)"
                trailColor="rgb(255 255 255 / 10%)"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
