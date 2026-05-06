import type { ProgramStudyMode } from '@/entities/program'

export type StudyModeFilter = 'all' | ProgramStudyMode
export type AdmissionYearFilter = 'all' | `${number}`
