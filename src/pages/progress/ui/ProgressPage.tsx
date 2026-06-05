import type { Course } from '@/entities/course'
import type { Program } from '@/entities/program'
import {
  type CourseProgressItem,
  type ProgressSelectChangePayload,
  type UserProgress,
} from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import {
  getCoursesApiV1CoursesGet,
  getProgramsApiV1ProgramsGet,
  getUserProgressApiV1UsersUserIdProgressGet,
} from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError } from '@/shared/lib/notify'
import { PageHero } from '@/widgets/page-hero'
import { ProgressAnalytics } from '@/widgets/progress-analytics'
import { ProgressCourses, type ProgressFilter } from '@/widgets/progress-courses'
import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { ProgressFocus } from './ProgressFocus/ProgressFocus'
import styles from './ProgressPage.module.css'
import { ProgressSummary } from './ProgressSummary/ProgressSummary'

const getPercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0)
const PROGRESS_PAGE_LIMIT = 20
const PROGRESS_PROGRAMS_LIMIT = 1

type ReadyCourse = Course & { id: number; type: NonNullable<Course['type']> }
type ReadyProgram = Program & { id: number }

const isCourseReady = (course: Course): course is ReadyCourse =>
  Boolean(course.id && course.created_at && course.updated_at && course.type)

const isProgramReady = (program: Program): program is ReadyProgram =>
  Boolean(program.id && program.created_at && program.updated_at)

export const ProgressPage = () => {
  const { user } = useUserStore(useShallow(useUserState))
  const [courses, setCourses] = useState<ReadyCourse[]>([])
  const [programs, setPrograms] = useState<ReadyProgram[]>([])
  const [progressItems, setProgressItems] = useState<UserProgress[]>([])
  const [activeFilter, setActiveFilter] = useState<ProgressFilter>('all')

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const userId = user.id
    let isActive = true

    const loadProgressPage = async () => {
      try {
        const [coursesResponse, programsResponse, progressResponse] = await Promise.all([
          getCoursesApiV1CoursesGet({
            query: {
              limit: PROGRESS_PAGE_LIMIT,
            },
          }),
          getProgramsApiV1ProgramsGet({
            query: {
              limit: PROGRESS_PROGRAMS_LIMIT,
            },
          }),
          getUserProgressApiV1UsersUserIdProgressGet({
            path: {
              user_id: userId,
            },
            query: {
              limit: PROGRESS_PAGE_LIMIT,
            },
          }),
        ])

        if (coursesResponse.error) {
          throw new Error(getErrorMessage(coursesResponse.error, 'Не удалось загрузить курсы.'))
        }

        if (programsResponse.error) {
          throw new Error(getErrorMessage(programsResponse.error, 'Не удалось загрузить программы.'))
        }

        if (progressResponse.error) {
          throw new Error(getErrorMessage(progressResponse.error, 'Не удалось загрузить прогресс.'))
        }

        if (!isActive) {
          return
        }

        setCourses((coursesResponse.data?.items ?? []).filter(isCourseReady))
        setPrograms((programsResponse.data?.items ?? []).filter(isProgramReady))
        setProgressItems(
          (progressResponse.data?.items ?? []).map((item) => item.progress as UserProgress),
        )
      } catch (error) {
        if (isActive) {
          notifyError(
            'Не удалось загрузить прогресс',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
        }
      }
    }

    loadProgressPage()
    setActiveFilter('all')

    return () => {
      isActive = false
    }
  }, [user?.id])

  const programTitleById = useMemo(
    () =>
      new Map(
        programs
          .filter((program): program is Program & { id: number } => Boolean(program.id))
          .map((program) => [program.id, program.title]),
      ),
    [programs],
  )

  const progressByCourseId = useMemo(
    () => new Map(progressItems.map((item) => [item.course_id, item])),
    [progressItems],
  )

  const courseItems = useMemo<CourseProgressItem[]>(
    () =>
      courses.map((course) => {
        const progress = progressByCourseId.get(course.id) ?? null

        return {
          course,
          progress,
          status: progress?.status ?? 'not_started',
        }
      }),
    [courses, progressByCourseId],
  )

  if (!user?.id) {
    return <Navigate to={ROUTES.LOGIN} replace />
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

        return nextProgress
      })

      return
    }

    setProgressItems((current) => {
      const nextProgress = current.some((item) => item.id === payload.newProgress.id)
        ? current.map((item) => (item.id === payload.newProgress.id ? payload.newProgress : item))
        : [...current, payload.newProgress]

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
