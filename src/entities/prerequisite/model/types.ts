import type { Prerequisite } from '@/shared/api/generated'

export type { Prerequisite, PrerequisiteCreate } from '@/shared/api/generated'

export type ProgramPrerequisite = Prerequisite & {
  program_id: number
}

export type TrackPrerequisite = Prerequisite & {
  career_track_id: number
}
