import type { CourseType } from '@/entities/course'

export type CourseTypeFilterValue = 'all' | CourseType

export const COURSE_TYPE_FILTER_ALL: CourseTypeFilterValue = 'all'

export const courseTypeFilterOptions: Array<{
  label: string
  value: CourseTypeFilterValue
}> = [
  {
    label: 'Все',
    value: COURSE_TYPE_FILTER_ALL,
  },
  {
    label: 'Обязательные',
    value: 'required',
  },
  {
    label: 'Элективные',
    value: 'elective',
  },
]

export const shouldDimCourseByTypeFilter = (
  courseType: CourseType,
  filterValue: CourseTypeFilterValue,
) => filterValue !== COURSE_TYPE_FILTER_ALL && courseType !== filterValue
