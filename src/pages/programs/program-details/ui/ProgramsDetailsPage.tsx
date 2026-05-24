import { mockCourses, type Course } from '@/entities/course'
import {
  mockPrerequisites,
  type Prerequisite,
  type PrerequisiteCreate,
} from '@/entities/prerequisite'
import { mockPrograms } from '@/entities/program'
import {
  mockProgress,
  type ProgressSelectChangePayload,
  type UserProgress,
} from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import { CoursePicker } from '@/features/course-picker'
import { ROUTES } from '@/shared/config'
import { ProgramFlowCanvas } from '@/widgets/program-flow'
import { useCallback, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { ProgramWorkspace } from './ProgramWorkspace/ProgramWorkspace'
import styles from './ProgramsDetailsPage.module.css'

export const ProgramDetailsPage = () => {
  const { programId } = useParams()
  const { user } = useUserStore(useShallow(useUserState))

  // MOCKS
  const [courses, setCourses] = useState<Course[]>(
    mockCourses.filter((course) => course.program_id === Number(programId)),
  )
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>(() => {
    const courseIds = mockCourses
      .filter((course) => course.program_id === Number(programId))
      .map((course) => course.id)

    return mockPrerequisites.filter(
      (prerequisite) =>
        courseIds.includes(prerequisite.course_id) &&
        courseIds.includes(prerequisite.prerequisite_course_id),
    )
  })

  const [progress, setProgress] = useState<UserProgress[]>(() => {
    const courseIds = mockCourses
      .filter((course) => course.program_id === Number(programId))
      .map((course) => course.id)

    return mockProgress.filter(
      (item) => item.user_id === user?.id && courseIds.includes(item.course_id),
    )
  })

  const handleCourseRemove = useCallback((courseId: number) => {
    setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId))
  }, [])

  const handleCourseUpdate = useCallback((updatedCourse: Course) => {
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
  }, [])

  const handleExistingCourseAdd = useCallback((course: Course) => {
    setCourses((currentCourses) => {
      const alreadyExists = currentCourses.some((currentCourse) => currentCourse.id === course.id)

      if (alreadyExists) {
        return currentCourses
      }

      return [...currentCourses, course]
    })
  }, [])

  const handleNewCourseAdd = useCallback((course: Course) => {
    setCourses((currentCourses) => [...currentCourses, course])
  }, [])

  const handleEdgeConnect = useCallback(
    async (courseId: number, prerequisiteCreate: PrerequisiteCreate) => {
      const tempPrerequisite: Prerequisite = {
        id: -Date.now(),
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

        const createdPrerequisite: Prerequisite = {
          ...tempPrerequisite,
          id: Date.now(),
        }

        setPrerequisites((current) =>
          current.map((prerequisite) =>
            prerequisite.id === tempPrerequisite.id ? createdPrerequisite : prerequisite,
          ),
        )
      } catch {
        setPrerequisites((current) =>
          current.filter((prerequisite) => prerequisite.id !== tempPrerequisite.id),
        )
      }
    },
    [],
  )

  const handleEdgeDelete = useCallback(async (prerequisite: Prerequisite) => {
    const previousPrerequisite = prerequisite

    setPrerequisites((current) => current.filter((item) => item.id !== prerequisite.id))

    try {
      // TODO: заменить задержку на удаление prerequisite через API.
      await new Promise((resolve) => setTimeout(resolve, 600))
    } catch {
      setPrerequisites((current) => [...current, previousPrerequisite])
    }
  }, [])

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

  const numericProgramId = Number(programId)
  const program = mockPrograms.find(({ id }) => id === numericProgramId)

  if (!program || Number.isNaN(numericProgramId)) return <NavLink to={ROUTES.NOT_FOUND} />

  const canEditProgram = program.user_id === user?.id || user?.role === 'admin'

  return (
    <div>
      <ProgramWorkspace program={program} />

      <div className={styles.canvas}>
        <ProgramFlowCanvas
          courses={courses}
          prerequisites={prerequisites}
          progress={progress}
          onCourseRemove={handleCourseRemove}
          onCourseUpdate={handleCourseUpdate}
          onProgressChange={handleProgressChange}
          onEdgeConnect={handleEdgeConnect}
          onEdgeDelete={handleEdgeDelete}
          canEditFlow={canEditProgram}
        />

        {canEditProgram && (
          <CoursePicker
            courses={mockCourses}
            programCourses={courses}
            onExistingCourseAdd={handleExistingCourseAdd}
            onNewCourseAdd={handleNewCourseAdd}
          />
        )}
      </div>
    </div>
  )
}
