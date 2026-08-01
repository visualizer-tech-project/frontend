export type { PrerequisiteCreate } from '@/shared/api/generated'

// TODO(api): для холста нужен endpoint, который возвращает строки связей prerequisite с id и областью применения. Сейчас GET /courses/{course_id}/prerequisites возвращает только список курсов-пререквизитов, поэтому UI хранит глобальную пару id курсов.
export type Prerequisite = Pick<
  import('@/shared/api/generated').PrerequisitePublic,
  'course_id' | 'prerequisite_course_id'
>

export const getPrerequisiteKey = (
  prerequisite: Pick<Prerequisite, 'course_id' | 'prerequisite_course_id'>,
) => `${prerequisite.course_id}:${prerequisite.prerequisite_course_id}`
