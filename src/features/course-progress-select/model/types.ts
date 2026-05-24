import { progressStatusLabels, type ProgressStatus } from '@/entities/progress'

export const progressStatusOptions = [
  {
    label: progressStatusLabels.not_started,
    value: 'not_started',
  },
  {
    label: progressStatusLabels.in_progress,
    value: 'in_progress',
  },
  {
    label: progressStatusLabels.completed,
    value: 'completed',
  },
] satisfies Array<{
  label: string
  value: ProgressStatus
}>
