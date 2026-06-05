export const PROGRAM_IMPORT_ACCEPT = '.csv,.xls,.xlsx'

export const PROGRAM_IMPORT_ALLOWED_EXTENSIONS = ['csv', 'xls', 'xlsx'] as const

export const PROGRAM_IMPORT_MAX_SIZE_MB = 10

export const PROGRAM_IMPORT_COLUMNS = [
  'course_title',
  'course_description',
  'course_type',
  'prerequisite_titles',
] as const

export const PROGRAM_IMPORT_COURSE_TYPES = ['required', 'elective'] as const

export const PROGRAM_IMPORT_EXAMPLE_ROWS = [
  {
    course_title: 'Алгоритмы',
    course_description: 'Базовые алгоритмы и структуры данных',
    course_type: 'required',
    prerequisite_titles: '',
  },
  {
    course_title: 'React',
    course_description: 'Компоненты и состояние',
    course_type: 'elective',
    prerequisite_titles: 'Алгоритмы',
  },
  {
    course_title: 'TypeScript',
    course_description: 'Типизация приложения',
    course_type: 'required',
    prerequisite_titles: 'Алгоритмы|React',
  },
] satisfies Array<Record<(typeof PROGRAM_IMPORT_COLUMNS)[number], string>>
