import type { CourseType } from '@/shared/api/generated'

export const courseTypeLabels: Record<CourseType, string> = {
  elective: 'Элективный',
  required: 'Обязательный',
}

export const courseTypeOptions: Array<{ label: string; value: CourseType }> = [
  { label: courseTypeLabels.required, value: 'required' },
  { label: courseTypeLabels.elective, value: 'elective' },
]
