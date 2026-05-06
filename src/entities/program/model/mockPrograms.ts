import type { Program } from './types'

export const mockPrograms: Program[] = [
  {
    id: 1,
    title: 'Введение в программирование',
    description:
      'Основы алгоритмов, переменных, условий и функций на Python с мини-проектами после каждого модуля.',
    study_mode: 'full-time',
    admission_year: 2024,
    created_by: 1,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Веб-разработка на React',
    description:
      'Практика сборки интерфейсов на React и TypeScript: роутинг, формы, состояние и работа с API.',
    study_mode: 'full-time',
    admission_year: 2024,
    created_by: 1,
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Базы данных и SQL',
    description:
      'Проектирование таблиц, нормализация, индексы и написание прикладных запросов для продуктовых задач.',
    study_mode: 'part-time',
    admission_year: 2023,
    created_by: 2,
    created_at: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    title: 'Машинное обучение',
    description:
      'Классические алгоритмы ML, подготовка датасетов и валидация моделей на реальных кейсах.',
    study_mode: 'full-time',
    admission_year: 2025,
    created_by: 2,
    created_at: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    title: 'Мобильная разработка на Kotlin',
    description:
      'Создание Android-приложений с чистой архитектурой, навигацией и публикацией сборок.',
    study_mode: 'part-time',
    admission_year: 2025,
    created_by: 3,
    created_at: '2026-01-05T00:00:00.000Z',
  },
]
