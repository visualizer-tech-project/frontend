import type { CareerTrack } from './types'

const teachers = [
  {
    id: 1,
    email: 'teacher1@example.com',
    first_name: 'Иван',
    last_name: 'Петров',
    role: 'teacher' as const,
    status: 'confirmed' as const,
    created_at: '2025-12-01T00:00:00.000Z',
    updated_at: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 2,
    email: 'teacher2@example.com',
    first_name: 'Анна',
    last_name: 'Смирнова',
    role: 'teacher' as const,
    status: 'confirmed' as const,
    created_at: '2025-12-05T00:00:00.000Z',
    updated_at: '2026-02-11T00:00:00.000Z',
  },
  {
    id: 3,
    email: 'teacher3@example.com',
    first_name: 'Олег',
    last_name: 'Васильев',
    role: 'teacher' as const,
    status: 'confirmed' as const,
    created_at: '2025-12-07T00:00:00.000Z',
    updated_at: '2026-02-12T00:00:00.000Z',
  },
]

export const mockTracks: CareerTrack[] = [
  {
    id: 1,
    title: 'Frontend Engineer',
    description: 'Трек по развитию во frontend: от верстки до архитектуры SPA.',
    user_id: 1,
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-10T00:00:00.000Z',
    courses_count: 3,
    user: teachers[0],
  },
  {
    id: 2,
    title: 'Backend Engineer',
    description: 'Трек по серверной разработке: API, БД, очереди и интеграции.',
    user_id: 2,
    created_at: '2026-02-02T00:00:00.000Z',
    updated_at: '2026-02-11T00:00:00.000Z',
    courses_count: 3,
    user: teachers[1],
  },
  {
    id: 3,
    title: 'Data Scientist',
    description: 'Трек по аналитике и ML: данные, модели, эксперименты и выводы.',
    user_id: 3,
    created_at: '2026-02-03T00:00:00.000Z',
    updated_at: '2026-02-12T00:00:00.000Z',
    courses_count: 3,
    user: teachers[2],
  },
]
