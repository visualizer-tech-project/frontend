import { mockCourses, type Course } from '@/entities/course'
import {
  mockProgramPrerequisites,
  type Prerequisite,
  type PrerequisiteCreate,
  type ProgramPrerequisite,
} from '@/entities/prerequisite'
import { mockPrograms } from '@/entities/program'
import { type ProgressSelectChangePayload, type UserProgress } from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import { CoursePicker } from '@/features/course-picker'
import { ROUTES } from '@/shared/config'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { useMockLoading } from '@/shared/lib/useMockLoading'
import { wait } from '@/shared/lib/wait'
import { LearningFlowCanvas } from '@/widgets/learning-flow'
import { useCallback, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import {
  getProgramCourses,
  getProgramPrerequisites,
  getProgramProgress,
} from '../lib/getProgramMockData'
import { ProgramWorkspace } from './ProgramWorkspace/ProgramWorkspace'
import styles from './ProgramsDetailsPage.module.css'

export const ProgramDetailsPage = () => {
  const { programId } = useParams()
  const { user } = useUserStore(useShallow(useUserState))
  const isProgramLoading = useMockLoading([programId, user?.id])
  const numericProgramId = Number(programId)

  // MOCKS
  const [courses, setCourses] = useState<Course[]>(() => getProgramCourses(numericProgramId))
  const [prerequisites, setPrerequisites] = useState<ProgramPrerequisite[]>(() =>
    getProgramPrerequisites(numericProgramId),
  )

  const [progress, setProgress] = useState<UserProgress[]>(() =>
    getProgramProgress(numericProgramId, user?.id),
  )
  const [removingCourseIds, setRemovingCourseIds] = useState<Course['id'][]>([])
  const [removingPrerequisiteIds, setRemovingPrerequisiteIds] = useState<
    ProgramPrerequisite['id'][]
  >([])

  useEffect(() => {
    setCourses(getProgramCourses(numericProgramId))
    setPrerequisites(getProgramPrerequisites(numericProgramId))
    setProgress(getProgramProgress(numericProgramId, user?.id))
  }, [numericProgramId, user?.id])

  const handleCourseRemove = useCallback(async (courseId: number) => {
    setRemovingCourseIds((current) =>
      current.includes(courseId) ? current : [...current, courseId],
    )

    try {
      // TODO: заменить задержку на удаление курса из программы через API.
      await wait(600)

      setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId))
      setPrerequisites((current) =>
        current.filter(
          (prerequisite) =>
            prerequisite.course_id !== courseId && prerequisite.prerequisite_course_id !== courseId,
        ),
      )
      notifySuccess('Курс удален', 'Курс успешно удален с холста.')
    } catch {
      notifyError('Не удалось удалить курс', 'Попробуйте удалить курс еще раз.')
    } finally {
      setRemovingCourseIds((current) => current.filter((id) => id !== courseId))
    }
  }, [])

  const handleCourseUpdate = useCallback(
    (updatedCourse: Course) => {
      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === updatedCourse.id
            ? {
                ...course,
                ...updatedCourse,
              }
            : course,
        ),
      )
    },
    [numericProgramId],
  )

  const handleExistingCourseAdd = useCallback(
    (course: Course) => {
      setCourses((currentCourses) => {
        const alreadyExists = currentCourses.some((currentCourse) => currentCourse.id === course.id)

        if (alreadyExists) {
          return currentCourses
        }

        return [...currentCourses, course]
      })
    },
    [numericProgramId],
  )

  const handleNewCourseAdd = useCallback((course: Course) => {
    setCourses((currentCourses) => [...currentCourses, course])
  }, [])

  const handleEdgeConnect = useCallback(
    async (courseId: number, prerequisiteCreate: PrerequisiteCreate) => {
      const tempPrerequisite: ProgramPrerequisite = {
        id: -Date.now(),
        program_id: numericProgramId,
        course_id: courseId,
        prerequisite_course_id: prerequisiteCreate.prerequisite_course_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setPrerequisites((current) => {
        const alreadyExists = current.some(
          (item) =>
            item.course_id === courseId &&
            item.prerequisite_course_id === prerequisiteCreate.prerequisite_course_id,
        )

        if (alreadyExists) {
          return current
        }

        return [...current, tempPrerequisite]
      })

      try {
        // TODO: заменить задержку на создание prerequisite через API.
        await new Promise((resolve) => setTimeout(resolve, 600))

        const createdPrerequisite: ProgramPrerequisite = {
          ...tempPrerequisite,
          id: Date.now(),
        }

        mockProgramPrerequisites.push(createdPrerequisite)

        setPrerequisites((current) =>
          current.map((prerequisite) =>
            prerequisite.id === tempPrerequisite.id ? createdPrerequisite : prerequisite,
          ),
        )
        notifySuccess('Связь добавлена', 'Зависимость между курсами успешно сохранена.')
      } catch {
        setPrerequisites((current) =>
          current.filter((prerequisite) => prerequisite.id !== tempPrerequisite.id),
        )
        notifyError('Не удалось добавить связь', 'Изменение откатилось. Попробуйте еще раз.')
      }
    },
    [numericProgramId],
  )

  const handleEdgeDelete = useCallback(
    async (prerequisite: Prerequisite) => {
      const previousPrerequisite = prerequisite as ProgramPrerequisite

      setRemovingPrerequisiteIds((current) =>
        current.includes(prerequisite.id) ? current : [...current, prerequisite.id],
      )
      setPrerequisites((current) => current.filter((item) => item.id !== prerequisite.id))

      try {
        // TODO: заменить задержку на удаление prerequisite через API.
        await wait(600)

        const prerequisiteIndex = mockProgramPrerequisites.findIndex(
          (item) => item.id === prerequisite.id && item.program_id === numericProgramId,
        )

        if (prerequisiteIndex !== -1) {
          mockProgramPrerequisites.splice(prerequisiteIndex, 1)
        }

        notifySuccess('Связь удалена', 'Зависимость между курсами успешно удалена.')
      } catch {
        setPrerequisites((current) => [...current, previousPrerequisite])
        notifyError('Не удалось удалить связь', 'Изменение откатилось. Попробуйте еще раз.')
      } finally {
        setRemovingPrerequisiteIds((current) => current.filter((id) => id !== prerequisite.id))
      }
    },
    [numericProgramId],
  )

  const handleProgressChange = useCallback((payload: ProgressSelectChangePayload) => {
    setProgress((current) => {
      if (payload.type === 'deleted') {
        return current.filter(
          (item) => !(item.user_id === payload.userId && item.course_id === payload.courseId),
        )
      }

      return current.some((item) => item.id === payload.newProgress.id)
        ? current.map((item) => (item.id === payload.newProgress.id ? payload.newProgress : item))
        : [...current, payload.newProgress]
    })
  }, [])

  const program = mockPrograms.find(({ id }) => id === numericProgramId)

  if (!program || Number.isNaN(numericProgramId)) return <NavLink to={ROUTES.NOT_FOUND} />

  const canEditProgram = program.user_id === user?.id || user?.role === 'admin'

  return (
    <div>
      <ProgramWorkspace program={program} />

      <div className={styles.canvas}>
        <LearningFlowCanvas
          courses={courses}
          prerequisites={prerequisites}
          progress={progress}
          onCourseRemove={handleCourseRemove}
          onCourseUpdate={handleCourseUpdate}
          onProgressChange={handleProgressChange}
          onEdgeConnect={handleEdgeConnect}
          onEdgeDelete={handleEdgeDelete}
          canEditFlow={canEditProgram}
          isLoading={isProgramLoading}
          isEdgeDeleting={removingPrerequisiteIds.length > 0}
          removingCourseIds={removingCourseIds}
        />

        {canEditProgram && (
          <CoursePicker
            courses={mockCourses}
            selectedCourses={courses}
            onExistingCourseAdd={handleExistingCourseAdd}
            onNewCourseAdd={handleNewCourseAdd}
            isLoading={isProgramLoading}
          />
        )}
      </div>
    </div>
  )
}
