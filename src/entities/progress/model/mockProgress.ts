import type { UserProgress } from './types'

export const mockProgress: UserProgress[] = [
  {
    id: 1,
    user_id: 1,
    course_id: 1,
    status: 'completed',
    grade: 92,
    started_at: '2026-01-10T00:00:00.000Z',
    completed_at: '2026-01-20T00:00:00.000Z',
    created_at: '2026-01-10T00:00:00.000Z',
    updated_at: '2026-01-20T00:00:00.000Z',
  },

  {
    id: 2,
    user_id: 1,
    course_id: 2,
    status: 'in_progress',
    grade: null,
    started_at: '2026-01-22T00:00:00.000Z',
    completed_at: null,
    created_at: '2026-01-22T00:00:00.000Z',
    updated_at: '2026-01-25T00:00:00.000Z',
  },

  {
    id: 3,
    user_id: 2,
    course_id: 3,
    status: 'not_started',
    grade: null,
    started_at: null,
    completed_at: null,
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-01-15T00:00:00.000Z',
  },

  {
    id: 4,
    user_id: 2,
    course_id: 4,
    status: 'completed',
    grade: 100,
    started_at: '2026-02-01T00:00:00.000Z',
    completed_at: '2026-02-14T00:00:00.000Z',
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-14T00:00:00.000Z',
  },

  {
    id: 5,
    user_id: 3,
    course_id: 5,
    status: 'in_progress',
    grade: 74,
    started_at: '2026-03-02T00:00:00.000Z',
    completed_at: null,
    created_at: '2026-03-02T00:00:00.000Z',
    updated_at: '2026-03-05T00:00:00.000Z',
  },
]
