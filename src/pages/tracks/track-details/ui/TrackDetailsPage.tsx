import { mockCourses, type Course } from '@/entities/course'
import {
  mockTrackPrerequisites,
  type Prerequisite,
  type PrerequisiteCreate,
  type TrackPrerequisite,
} from '@/entities/prerequisite'
import { type ProgressSelectChangePayload, type UserProgress } from '@/entities/progress'
import { mockTracks, mockTrackCourses } from '@/entities/track'
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
  getTrackPrerequisitesForCourses,
  getTrackCourses,
  getTrackPrerequisites,
  getTrackProgress,
} from '../lib/getTrackMockData'
import styles from './TrackDetailsPage.module.css'
import { TrackWorkspace } from './TrackWorkspace'

export const TrackDetailsPage = () => {
  const { trackId } = useParams()
  const { user } = useUserStore(useShallow(useUserState))
  const numericTrackId = Number(trackId)
  const isTrackLoading = useMockLoading([trackId, user?.id])

  // MOCKS
  const [courses, setCourses] = useState<Course[]>(() => getTrackCourses(numericTrackId))
  const [prerequisites, setPrerequisites] = useState<TrackPrerequisite[]>(() =>
    getTrackPrerequisites(numericTrackId),
  )
  const [progress, setProgress] = useState<UserProgress[]>(() =>
    getTrackProgress(numericTrackId, user?.id),
  )
  const [removingCourseIds, setRemovingCourseIds] = useState<Course['id'][]>([])
  const [removingPrerequisiteIds, setRemovingPrerequisiteIds] = useState<TrackPrerequisite['id'][]>(
    [],
  )

  useEffect(() => {
    setCourses(getTrackCourses(numericTrackId))
    setPrerequisites(getTrackPrerequisites(numericTrackId))
    setProgress(getTrackProgress(numericTrackId, user?.id))
  }, [numericTrackId, user?.id])

  const handleCourseRemove = useCallback(
    async (courseId: number) => {
      setRemovingCourseIds((current) =>
        current.includes(courseId) ? current : [...current, courseId],
      )

      try {
        // TODO: заменить задержку на удаление курса из трека через API.
        await wait(600)

        setCourses((currentCourses) => {
          const nextCourses = currentCourses.filter((course) => course.id !== courseId)
          const trackCourseIndex = mockTrackCourses.findIndex(
            (trackCourse) =>
              trackCourse.career_track_id === numericTrackId && trackCourse.course_id === courseId,
          )
          const currentTrack = mockTracks.find(({ id }) => id === numericTrackId)

          if (trackCourseIndex !== -1) {
            mockTrackCourses.splice(trackCourseIndex, 1)
          }

          if (currentTrack) {
            currentTrack.courses_count = nextCourses.length
            currentTrack.updated_at = new Date().toISOString()
          }

          setPrerequisites((current) =>
            current.filter(
              (prerequisite) =>
                prerequisite.course_id !== courseId &&
                prerequisite.prerequisite_course_id !== courseId,
            ),
          )
          return nextCourses
        })
        notifySuccess('Курс удален', 'Курс успешно удален из трека.')
      } catch {
        notifyError('Не удалось удалить курс', 'Попробуйте удалить курс еще раз.')
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
    (course: Course) => {
      setCourses((currentCourses) => {
        const alreadyExists = currentCourses.some((currentCourse) => currentCourse.id === course.id)

        if (alreadyExists) {
          return currentCourses
        }

        const nextCourses = [...currentCourses, course]
        const now = new Date().toISOString()
        const currentTrack = mockTracks.find(({ id }) => id === numericTrackId)

        mockTrackCourses.push({
          id: Date.now(),
          career_track_id: numericTrackId,
          course_id: course.id,
          order_index: nextCourses.length,
          created_at: now,
          updated_at: now,
        })

        if (currentTrack) {
          currentTrack.courses_count = nextCourses.length
          currentTrack.updated_at = now
        }

        setPrerequisites(getTrackPrerequisitesForCourses(numericTrackId, nextCourses))

        return nextCourses
      })
    },
    [numericTrackId],
  )

  const handleEdgeConnect = useCallback(
    async (courseId: number, prerequisiteCreate: PrerequisiteCreate) => {
      const tempPrerequisite: TrackPrerequisite = {
        id: -Date.now(),
        career_track_id: numericTrackId,
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
        await wait(600)

        const createdPrerequisite: TrackPrerequisite = {
          ...tempPrerequisite,
          id: Date.now(),
        }

        mockTrackPrerequisites.push(createdPrerequisite)

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
    [numericTrackId],
  )

  const handleEdgeDelete = useCallback(
    async (prerequisite: Prerequisite) => {
      const previousPrerequisite = prerequisite as TrackPrerequisite

      setRemovingPrerequisiteIds((current) =>
        current.includes(prerequisite.id) ? current : [...current, prerequisite.id],
      )
      setPrerequisites((current) => current.filter((item) => item.id !== prerequisite.id))

      try {
        // TODO: заменить задержку на удаление prerequisite через API.
        await wait(600)

        const prerequisiteIndex = mockTrackPrerequisites.findIndex(
          (item) => item.id === prerequisite.id && item.career_track_id === numericTrackId,
        )

        if (prerequisiteIndex !== -1) {
          mockTrackPrerequisites.splice(prerequisiteIndex, 1)
        }

        notifySuccess('Связь удалена', 'Зависимость между курсами успешно удалена.')
      } catch {
        setPrerequisites((current) => [...current, previousPrerequisite])
        notifyError('Не удалось удалить связь', 'Изменение откатилось. Попробуйте еще раз.')
      } finally {
        setRemovingPrerequisiteIds((current) => current.filter((id) => id !== prerequisite.id))
      }
    },
    [numericTrackId],
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

  const track = mockTracks.find(({ id }) => id === numericTrackId)

  if (!track || Number.isNaN(numericTrackId)) return <NavLink to={ROUTES.NOT_FOUND} />

  const canEditTrack = track.user_id === user?.id || user?.role === 'admin'

  return (
    <div>
      <TrackWorkspace track={track} courses={courses} />

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
          isEdgeDeleting={removingPrerequisiteIds.length > 0}
          removingCourseIds={removingCourseIds}
        />

        {canEditTrack && (
          <CoursePicker
            courses={mockCourses}
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
