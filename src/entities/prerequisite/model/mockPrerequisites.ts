import type { Prerequisite } from '@/shared/api/generated'

export const mockPrerequisites: Prerequisite[] = [
  {
    id: 1,
    course_id: 2,
    prerequisite_course_id: 1,
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 2,
    course_id: 3,
    prerequisite_course_id: 1,
    created_at: '2026-02-02T00:00:00.000Z',
    updated_at: '2026-02-02T00:00:00.000Z',
  },
  {
    id: 3,
    course_id: 3,
    prerequisite_course_id: 2,
    created_at: '2026-02-03T00:00:00.000Z',
    updated_at: '2026-02-03T00:00:00.000Z',
  },
  {
    id: 4,
    course_id: 5,
    prerequisite_course_id: 4,
    created_at: '2026-02-04T00:00:00.000Z',
    updated_at: '2026-02-04T00:00:00.000Z',
  },
]
