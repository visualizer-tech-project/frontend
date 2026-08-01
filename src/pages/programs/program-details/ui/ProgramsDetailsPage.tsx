import { type Course } from '@/entities/course'
import {
  getPrerequisiteKey,
  type Prerequisite,
  type PrerequisiteCreate,
} from '@/entities/prerequisite'
import type { Program } from '@/entities/program'
import { type ProgressSelectChangePayload, type UserProgress } from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import { CoursePicker } from '@/features/course-picker'
import {
  addPrerequisiteApiV1CoursesCourseIdPrerequisitesPost,
  deleteCourseApiV1CoursesCourseIdDelete,
  getCoursesApiV1CoursesGet,
  getPrerequisitesApiV1CoursesCourseIdPrerequisitesGet,
  getProgramByIdApiV1ProgramsProgramIdGet,
  getUserProgressApiV1UsersUserIdProgressGet,
  removePrerequisiteApiV1CoursesCourseIdPrerequisitesPrerequisiteCourseIdDelete,
} from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { LearningFlowCanvas } from '@/widgets/learning-flow'
import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { ProgramWorkspace } from './ProgramWorkspace/ProgramWorkspace'
import styles from './ProgramsDetailsPage.module.css'

const DETAILS_PAGE_LIMIT = 20

type ApiResponse<TData, TError = unknown> = {
  data?: TData
  error?: TError
}

const getRequiredData = <TData, TError>(
  response: ApiResponse<TData, TError>,
  fallbackMessage: string,
) => {
  if (response.error || !response.data) {
    throw new Error(getErrorMessage(response.error, fallbackMessage))
  }

  return response.data
}

type ReadyCourse = Course & { id: number; type: NonNullable<Course['type']> }

const isCourseReady = (course: Course): course is ReadyCourse =>
  Boolean(course.id && course.created_at && course.updated_at && course.type)

const fetchCoursePrerequisitesForCourses = async (
  courses: ReadyCourse[],
): Promise<Prerequisite[]> => {
  const courseIds = new Set(courses.map((course) => course.id))

  const prerequisites = await Promise.all(
    courses.map(async (course) => {
      const data = getRequiredData(
        await getPrerequisitesApiV1CoursesCourseIdPrerequisitesGet({
          path: {
            course_id: course.id,
          },
        }),
        'Не удалось загрузить связи курсов.',
      )

      return data
        .filter((prerequisiteCourse) => prerequisiteCourse.id && courseIds.has(prerequisiteCourse.id))
        .map<Prerequisite>((prerequisiteCourse) => ({
          course_id: course.id,
          prerequisite_course_id: prerequisiteCourse.id as number,
        }))
    }),
  )

  return prerequisites.flat()
}

export const ProgramDetailsPage = () => {
  const { programId } = useParams()
  const { user } = useUserStore(useShallow(useUserState))
  const numericProgramId = Number(programId)
  const [program, setProgram] = useState<Program | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [isProgramLoading, setIsProgramLoading] = useState(true)
  const [removingCourseIds, setRemovingCourseIds] = useState<Course['id'][]>([])
  const [removingPrerequisiteKeys, setRemovingPrerequisiteKeys] = useState<string[]>([])

  useEffect(() => {
    let isActive = true

    const loadProgram = async () => {
      if (Number.isNaN(numericProgramId)) {
        setIsProgramLoading(false)
        return
      }

      setIsProgramLoading(true)

      try {
        const [programResponse, programCoursesResponse, allCoursesResponse] = await Promise.all([
          getProgramByIdApiV1ProgramsProgramIdGet({
            path: {
              program_id: numericProgramId,
            },
          }),
          getCoursesApiV1CoursesGet({
            query: {
              limit: DETAILS_PAGE_LIMIT,
              program_id: numericProgramId,
            },
          }),
          getCoursesApiV1CoursesGet({
            query: {
              limit: DETAILS_PAGE_LIMIT,
            },
          }),
        ])

        const loadedProgram = getRequiredData(programResponse, 'Не удалось загрузить программу.')
        const programCourses = getRequiredData(
          programCoursesResponse,
          'Не удалось загрузить курсы программы.',
        ).items.filter(isCourseReady)
        const allCourses = getRequiredData(
          allCoursesResponse,
          'Не удалось загрузить список курсов.',
        ).items.filter(isCourseReady)
        const loadedPrerequisites = await fetchCoursePrerequisitesForCourses(programCourses)
        const loadedProgress = user?.id
          ? getRequiredData(
              await getUserProgressApiV1UsersUserIdProgressGet({
                path: {
                  user_id: user.id,
                },
                query: {
                  limit: DETAILS_PAGE_LIMIT,
                  program_id: numericProgramId,
                },
              }),
              'Не удалось загрузить прогресс.',
            ).items.map((item) => item.progress as UserProgress)
          : []

        if (!isActive) {
          return
        }

        setProgram(loadedProgram as Program)
        setCourses(programCourses)
        setAvailableCourses(allCourses)
        setPrerequisites(loadedPrerequisites)
        setProgress(loadedProgress)
      } catch (error) {
        if (isActive) {
          notifyError(
            'Не удалось загрузить программу',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
        }
      } finally {
        if (isActive) {
          setIsProgramLoading(false)
        }
      }
    }

    loadProgram()

    return () => {
      isActive = false
    }
  }, [numericProgramId, user?.id])

  const handleCourseRemove = useCallback(async (courseId: number) => {
    setRemovingCourseIds((current) =>
      current.includes(courseId) ? current : [...current, courseId],
    )

    try {
      const { error } = await deleteCourseApiV1CoursesCourseIdDelete({
        path: {
          course_id: courseId,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Попробуйте удалить курс еще раз.'))
      }

      setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId))
      setPrerequisites((current) =>
        current.filter(
          (prerequisite) =>
            prerequisite.course_id !== courseId && prerequisite.prerequisite_course_id !== courseId,
        ),
      )
      notifySuccess('Курс удален с холста', 'Он больше не отображается в программе.')
    } catch (error) {
      notifyError(
        'Не удалось удалить курс',
        getErrorMessage(error, 'Попробуйте удалить курс еще раз.'),
      )
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
    async (course: Course) => {
      const alreadyExists = courses.some((currentCourse) => currentCourse.id === course.id)

      if (alreadyExists) {
        throw new Error('Курс уже есть в программе.')
      }

      throw new Error(
        'В API пока нет endpoint для привязки существующего курса к программе без копирования или перемещения.',
      )
    },
    [courses],
  )

  const handleNewCourseAdd = useCallback((course: Course) => {
    setCourses((currentCourses) =>
      currentCourses.some((currentCourse) => currentCourse.id === course.id)
        ? currentCourses
        : [...currentCourses, course],
    )
    setAvailableCourses((currentCourses) =>
      currentCourses.some((currentCourse) => currentCourse.id === course.id)
        ? currentCourses
        : [...currentCourses, course],
    )
  }, [])

  const handleEdgeConnect = useCallback(
    async (courseId: number, prerequisiteCreate: PrerequisiteCreate) => {
      const tempPrerequisite: Prerequisite = {
        course_id: courseId,
        prerequisite_course_id: prerequisiteCreate.prerequisite_course_id,
      }
      const tempPrerequisiteKey = getPrerequisiteKey(tempPrerequisite)

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
        const { error } = await addPrerequisiteApiV1CoursesCourseIdPrerequisitesPost({
          path: {
            course_id: courseId,
          },
          body: prerequisiteCreate,
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось добавить связь.'))
        }

        setPrerequisites((current) =>
          current.map((prerequisite) =>
            getPrerequisiteKey(prerequisite) === tempPrerequisiteKey
              ? tempPrerequisite
              : prerequisite,
          ),
        )
        notifySuccess('Связь добавлена', 'Зависимость сохранена.')
      } catch (error) {
        setPrerequisites((current) =>
          current.filter(
            (prerequisite) => getPrerequisiteKey(prerequisite) !== tempPrerequisiteKey,
          ),
        )
        notifyError(
          'Не удалось добавить связь',
          getErrorMessage(error, 'Попробуйте повторить позже.'),
        )
      }
    },
    [],
  )

  const handleEdgeDelete = useCallback(async (prerequisite: Prerequisite) => {
    const previousPrerequisite = prerequisite
    const prerequisiteKey = getPrerequisiteKey(prerequisite)

    setRemovingPrerequisiteKeys((current) =>
      current.includes(prerequisiteKey) ? current : [...current, prerequisiteKey],
    )
    setPrerequisites((current) =>
      current.filter((item) => getPrerequisiteKey(item) !== prerequisiteKey),
    )

    try {
      const { error } =
        await removePrerequisiteApiV1CoursesCourseIdPrerequisitesPrerequisiteCourseIdDelete({
          path: {
            course_id: prerequisite.course_id,
            prerequisite_course_id: prerequisite.prerequisite_course_id,
          },
        })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось удалить связь.'))
      }

      notifySuccess('Связь удалена', 'Зависимость удалена.')
    } catch (error) {
      setPrerequisites((current) => [...current, previousPrerequisite])
      notifyError(
        'Не удалось удалить связь',
        getErrorMessage(error, 'Попробуйте повторить позже.'),
      )
    } finally {
      setRemovingPrerequisiteKeys((current) => current.filter((key) => key !== prerequisiteKey))
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

  if (!isProgramLoading && (!program || Number.isNaN(numericProgramId))) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />
  }

  const canEditProgram = Boolean(
    program && (program.user_id === user?.id || user?.role === 'admin'),
  )

  return (
    <div>
      {program ? <ProgramWorkspace program={program} /> : null}

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
          isEdgeDeleting={removingPrerequisiteKeys.length > 0}
          removingCourseIds={removingCourseIds}
        />

        {canEditProgram && (
          <CoursePicker
            courses={availableCourses}
            selectedCourses={courses}
            onExistingCourseAdd={handleExistingCourseAdd}
            onNewCourseAdd={handleNewCourseAdd}
            programId={numericProgramId}
            userId={user?.id ?? undefined}
            isLoading={isProgramLoading}
          />
        )}
      </div>
    </div>
  )
}
