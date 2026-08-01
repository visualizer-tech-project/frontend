import { type Course } from '@/entities/course'
import {
  getPrerequisiteKey,
  type Prerequisite,
  type PrerequisiteCreate,
} from '@/entities/prerequisite'
import { type ProgressSelectChangePayload, type UserProgress } from '@/entities/progress'
import type { CareerTrack } from '@/entities/track'
import { useUserState, useUserStore } from '@/entities/user'
import { CoursePicker } from '@/features/course-picker'
import {
  addCourseToTrackApiV1CareerTracksTrackIdCoursesPost,
  addPrerequisiteApiV1CoursesCourseIdPrerequisitesPost,
  getCoursesApiV1CoursesGet,
  getPrerequisitesApiV1CoursesCourseIdPrerequisitesGet,
  getTrackByIdApiV1CareerTracksTrackIdGet,
  getTrackCoursesApiV1CareerTracksTrackIdCoursesGet,
  getUserProgressApiV1UsersUserIdProgressGet,
  removeCourseFromTrackApiV1CareerTracksTrackIdCoursesCourseIdDelete,
  removePrerequisiteApiV1CoursesCourseIdPrerequisitesPrerequisiteCourseIdDelete,
} from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { LearningFlowCanvas } from '@/widgets/learning-flow'
import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './TrackDetailsPage.module.css'
import { TrackWorkspace } from './TrackWorkspace'

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

export const TrackDetailsPage = () => {
  const { trackId } = useParams()
  const { user } = useUserStore(useShallow(useUserState))
  const numericTrackId = Number(trackId)
  const [track, setTrack] = useState<CareerTrack | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [isTrackLoading, setIsTrackLoading] = useState(true)
  const [removingCourseIds, setRemovingCourseIds] = useState<Course['id'][]>([])
  const [removingPrerequisiteKeys, setRemovingPrerequisiteKeys] = useState<string[]>([])

  useEffect(() => {
    let isActive = true

    const loadTrack = async () => {
      if (Number.isNaN(numericTrackId)) {
        setIsTrackLoading(false)
        return
      }

      setIsTrackLoading(true)

      try {
        const [trackResponse, trackCoursesResponse, allCoursesResponse] = await Promise.all([
          getTrackByIdApiV1CareerTracksTrackIdGet({
            path: {
              track_id: numericTrackId,
            },
          }),
          getTrackCoursesApiV1CareerTracksTrackIdCoursesGet({
            path: {
              track_id: numericTrackId,
            },
            query: {
              limit: DETAILS_PAGE_LIMIT,
            },
          }),
          getCoursesApiV1CoursesGet({
            query: {
              limit: DETAILS_PAGE_LIMIT,
            },
          }),
        ])

        const loadedTrack = getRequiredData(trackResponse, 'Не удалось загрузить трек.')
        const trackCourses = getRequiredData(
          trackCoursesResponse,
          'Не удалось загрузить курсы трека.',
        )
        const loadedCourses = [...trackCourses]
          .sort((a, b) => a.order_index - b.order_index)
          .map((item) => item.course)
          .filter(isCourseReady)
        const allCourses = getRequiredData(
          allCoursesResponse,
          'Не удалось загрузить список курсов.',
        ).items.filter(isCourseReady)
        const courseIds = new Set(loadedCourses.map((course) => course.id))
        const loadedPrerequisites = await fetchCoursePrerequisitesForCourses(loadedCourses)
        const loadedProgress = user?.id
          ? getRequiredData(
              await getUserProgressApiV1UsersUserIdProgressGet({
                path: {
                  user_id: user.id,
                },
                query: {
                  limit: DETAILS_PAGE_LIMIT,
                },
              }),
              'Не удалось загрузить прогресс.',
            )
              .items.map((item) => item.progress as UserProgress)
              .filter((item) => courseIds.has(item.course_id))
          : []

        if (!isActive) {
          return
        }

        setTrack(loadedTrack as CareerTrack)
        setCourses(loadedCourses)
        setAvailableCourses(allCourses)
        setPrerequisites(loadedPrerequisites)
        setProgress(loadedProgress)
      } catch (error) {
        if (isActive) {
          notifyError(
            'Не удалось загрузить трек',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
        }
      } finally {
        if (isActive) {
          setIsTrackLoading(false)
        }
      }
    }

    loadTrack()

    return () => {
      isActive = false
    }
  }, [numericTrackId, user?.id])

  const handleCourseRemove = useCallback(
    async (courseId: Course['id']) => {
      if (!courseId) {
        notifyError('Не удалось удалить курс', 'Не удалось определить курс.')
        return
      }

      setRemovingCourseIds((current) =>
        current.includes(courseId) ? current : [...current, courseId],
      )

      try {
        const { error } = await removeCourseFromTrackApiV1CareerTracksTrackIdCoursesCourseIdDelete({
          path: {
            course_id: courseId,
            track_id: numericTrackId,
          },
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Попробуйте удалить курс еще раз.'))
        }

        setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId))
        setTrack((currentTrack) =>
          currentTrack
            ? {
                ...currentTrack,
                courses_count: Math.max(currentTrack.courses_count - 1, 0),
              }
            : currentTrack,
        )
        setPrerequisites((current) =>
          current.filter(
            (prerequisite) =>
              prerequisite.course_id !== courseId &&
              prerequisite.prerequisite_course_id !== courseId,
          ),
        )

        notifySuccess('Курс удален из трека', 'Он больше не входит в эту траекторию.')
      } catch (error) {
        notifyError(
          'Не удалось удалить курс',
          getErrorMessage(error, 'Попробуйте удалить курс еще раз.'),
        )
      } finally {
        setRemovingCourseIds((current) => current.filter((id) => id !== courseId))
      }
    },
    [numericTrackId],
  )

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

  const handleExistingCourseAdd = useCallback(
    async (course: Course) => {
      if (!isCourseReady(course)) {
        throw new Error('Не удалось определить курс.')
      }

      const alreadyExists = courses.some((currentCourse) => currentCourse.id === course.id)

      if (alreadyExists) {
        return
      }

      const { error } = await addCourseToTrackApiV1CareerTracksTrackIdCoursesPost({
        path: {
          track_id: numericTrackId,
        },
        body: {
          course_id: course.id,
          order_index: courses.length,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось добавить курс в трек.'))
      }

      const nextCourses = [...courses.filter(isCourseReady), course]
      const nextPrerequisites = await fetchCoursePrerequisitesForCourses(nextCourses)

      setCourses(nextCourses)
      setPrerequisites(nextPrerequisites)
      setTrack((currentTrack) =>
        currentTrack
          ? {
              ...currentTrack,
              courses_count: nextCourses.length,
            }
          : currentTrack,
      )
    },
    [courses, numericTrackId],
  )

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
          current.filter((prerequisite) => getPrerequisiteKey(prerequisite) !== tempPrerequisiteKey),
        )
        notifyError(
          'Не удалось добавить связь',
          getErrorMessage(error, 'Попробуйте повторить позже.'),
        )
      }
    },
    [],
  )

  const handleEdgeDelete = useCallback(
    async (prerequisite: Prerequisite) => {
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
    },
    [],
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

  if (!isTrackLoading && (!track || Number.isNaN(numericTrackId))) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />
  }

  const canEditTrack = Boolean(track && (track.user_id === user?.id || user?.role === 'admin'))

  return (
    <div>
      {track ? <TrackWorkspace track={track} courses={courses} /> : null}

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
          canEditFlow={canEditTrack}
          isLoading={isTrackLoading}
          isEdgeDeleting={removingPrerequisiteKeys.length > 0}
          removingCourseIds={removingCourseIds}
        />

        {canEditTrack && (
          <CoursePicker
            courses={availableCourses}
            selectedCourses={courses}
            onExistingCourseAdd={handleExistingCourseAdd}
            allowCourseCreate={false}
            isLoading={isTrackLoading}
          />
        )}
      </div>
    </div>
  )
}
