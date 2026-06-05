import type { TrackPrerequisite } from './types'

export const mockTrackPrerequisites: TrackPrerequisite[] = [
  {
    id: 101,
    career_track_id: 1,
    course_id: 2,
    prerequisite_course_id: 1,
    created_at: '2026-02-05T00:00:00.000Z',
    updated_at: '2026-02-05T00:00:00.000Z',
  },
  {
    id: 102,
    career_track_id: 2,
    course_id: 5,
    prerequisite_course_id: 3,
    created_at: '2026-02-06T00:00:00.000Z',
    updated_at: '2026-02-06T00:00:00.000Z',
  },
  {
    id: 103,
    career_track_id: 3,
    course_id: 5,
    prerequisite_course_id: 1,
    created_at: '2026-02-07T00:00:00.000Z',
    updated_at: '2026-02-07T00:00:00.000Z',
  },
]
