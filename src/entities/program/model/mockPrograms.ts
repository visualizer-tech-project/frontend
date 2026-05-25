import type { Program } from './types'

export const mockPrograms: Program[] = [
  {
    id: 1,
    title: 'Введение в программирование',
    description:
      'Основы алгоритмов, переменных, условий и функций на Python с мини-проектами после каждого модуля.',

    user_id: 1,

    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',

    user: {
      id: 1,
      email: 'teacher@example.com',
      first_name: 'Иван',
      last_name: 'Петров',
      role: 'teacher',
      status: 'confirmed',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  },

  {
    id: 2,
    title: 'Веб-разработка на React',
    description:
      'Практика сборки интерфейсов на React и TypeScript: роутинг, формы, состояние и работа с API.',

    user_id: 1,

    created_at: '2026-01-02T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z',

    user: {
      id: 1,
      email: 'teacher@example.com',
      first_name: 'Иван',
      last_name: 'Петров',
      role: 'teacher',
      status: 'confirmed',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  },
]
