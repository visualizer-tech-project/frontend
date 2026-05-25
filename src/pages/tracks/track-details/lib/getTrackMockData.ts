import { mockCourses, type Course } from '@/entities/course'
import { mockPrerequisites } from '@/entities/prerequisite'
import { mockProgress } from '@/entities/progress'
import { mockTrackCourses } from '@/entities/track'

export const getTrackCourses = (trackId: number) =>
  mockTrackCourses
    .filter((trackCourse) => trackCourse.career_track_id === trackId)
    .sort((left, right) => left.order_index - right.order_index)
    .map((trackCourse) => mockCourses.find((course) => course.id === trackCourse.course_id))
    .filter((course): course is Course => Boolean(course))

export const getPrerequisitesForCourses = (courses: Course[]) => {
  const courseIds = new Set(courses.map((course) => course.id))

  return mockPrerequisites.filter(
    (prerequisite) =>
      courseIds.has(prerequisite.course_id) && courseIds.has(prerequisite.prerequisite_course_id),
  )
}

export const getTrackPrerequisites = (trackId: number) =>
  getPrerequisitesForCourses(getTrackCourses(trackId))

export const getTrackProgress = (trackId: number, userId?: number) => {
  const courseIds = new Set(getTrackCourses(trackId).map((course) => course.id))

  return mockProgress.filter((item) => item.user_id === userId && courseIds.has(item.course_id))
}
