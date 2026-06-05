import {
  mockTrackCourses,
  mockTracks,
  type CareerTrack,
  type CareerTrackCourse,
} from '@/entities/track'

interface AddTrackToMocksParams {
  track: CareerTrack
  trackCourses: CareerTrackCourse[]
}

export const addTrackToMocks = ({ track, trackCourses }: AddTrackToMocksParams) => {
  mockTracks.push(track)
  mockTrackCourses.push(...trackCourses)
}
