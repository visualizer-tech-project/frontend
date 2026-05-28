import { mockCourses } from '@/entities/course'
import { mockPrograms } from '@/entities/program'
import {
  mockProgress,
  type CourseProgressItem,
  type ProgressSelectChangePayload,
  type UserProgress,
} from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { PageHero } from '@/widgets/page-hero'
import { ProgressAnalytics } from '@/widgets/progress-analytics'
import { ProgressCourses, type ProgressFilter } from '@/widgets/progress-courses'
import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { ProgressFocus } from './ProgressFocus/ProgressFocus'
import styles from './ProgressPage.module.css'
import { ProgressSummary } from './ProgressSummary/ProgressSummary'

const getPercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0)

const syncUserProgressToMocks = (userId: number, nextProgress: UserProgress[]) => {
  for (let index = mockProgress.length - 1; index >= 0; index -= 1) {
    if (mockProgress[index].user_id === userId) {
      mockProgress.splice(index, 1)
    }
  }

  mockProgress.push(...nextProgress)
}

export const ProgressPage = () => {
  const { user } = useUserStore(useShallow(useUserState))
  const [progressItems, setProgressItems] = useState<UserProgress[]>([])
  const [activeFilter, setActiveFilter] = useState<ProgressFilter>('all')

  useEffect(() => {
    setProgressItems(mockProgress.filter((item) => item.user_id === user?.id))
    setActiveFilter('all')
  }, [user?.id])

  const programTitleById = useMemo(
    () => new Map(mockPrograms.map((program) => [program.id, program.title])),
    [],
  )

  const progressByCourseId = useMemo(
    () => new Map(progressItems.map((item) => [item.course_id, item])),
    [progressItems],
  )

  const courseItems = useMemo<CourseProgressItem[]>(
    () =>
      mockCourses.map((course) => {
        const progress = progressByCourseId.get(course.id) ?? null

        return {
          course,
          progress,
          status: progress?.status ?? 'not_started',
        }
      }),
    [progressByCourseId],
  )

  if (!user) {
    return <NavLink to={ROUTES.LOGIN} />
  }

  const { completedItems, inProgressItems, notStartedItems, activeItems } = courseItems.reduce<{
    completedItems: CourseProgressItem[]
    inProgressItems: CourseProgressItem[]
    notStartedItems: CourseProgressItem[]
    activeItems: CourseProgressItem[]
  }>(
    (acc, el) => {
      if (el.status === 'completed') {
        acc.completedItems.push(el)
      } else if (el.status === 'in_progress') {
        acc.inProgressItems.push(el)
      } else if (el.status === 'not_started') {
        acc.notStartedItems.push(el)
      }
      if (el.status !== 'not_started') {
        acc.activeItems.push(el)
      }
      return acc
    },
    { completedItems: [], inProgressItems: [], notStartedItems: [], activeItems: [] },
  )

  const totalCourses = courseItems.length
  const completedPercent = getPercent(completedItems.length, totalCourses)

  const filteredCourseItems = courseItems.filter((item) => {
    if (activeFilter === 'all') {
      return true
    }

    if (activeFilter === 'active') {
      return item.status !== 'not_started'
    }

    return item.status === activeFilter
  })

  const heroStats = [
    { label: 'Пройдено', value: `${completedPercent}%` },
    { label: 'В процессе', value: inProgressItems.length },
    { label: 'Всего курсов', value: totalCourses },
  ]

  const handleProgressChange = (payload: ProgressSelectChangePayload) => {
    if (payload.type === 'deleted') {
      setProgressItems((current) => {
        const nextProgress = current.filter(
          (item) => !(item.user_id === payload.userId && item.course_id === payload.courseId),
        )

        syncUserProgressToMocks(payload.userId, nextProgress)

        return nextProgress
      })

      return
    }

    setProgressItems((current) => {
      const nextProgress = current.some((item) => item.id === payload.newProgress.id)
        ? current.map((item) => (item.id === payload.newProgress.id ? payload.newProgress : item))
        : [...current, payload.newProgress]

      syncUserProgressToMocks(payload.newProgress.user_id, nextProgress)

      return nextProgress
    })
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <PageHero
          description="Сводка по учебному прогрессу: статусы курсов, динамика прохождения и быстрые действия для обновления текущего состояния."
          eyebrow="Прогресс"
          stats={heroStats}
          title="Ваш учебный прогресс"
        />

        <ProgressSummary
          activeItems={activeItems}
          completedItems={completedItems}
          inProgressItems={inProgressItems}
          notStartedItems={notStartedItems}
        />

        <ProgressAnalytics
          completedItems={completedItems}
          inProgressItems={inProgressItems}
          notStartedItems={notStartedItems}
          totalCourses={totalCourses}
        />

        <ProgressCourses
          activeFilter={activeFilter}
          courseItems={courseItems}
          filteredCourseItems={filteredCourseItems}
          programTitleById={programTitleById}
          userId={user.id}
          onFilterChange={setActiveFilter}
          onProgressChange={handleProgressChange}
        />

        <ProgressFocus
          completedItems={completedItems}
          inProgressItems={inProgressItems}
          notStartedItems={notStartedItems}
        />
      </div>
    </section>
  )
}
