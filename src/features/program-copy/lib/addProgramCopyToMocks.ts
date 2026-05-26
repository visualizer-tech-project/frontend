import { mockProgramPrerequisites, type ProgramPrerequisite } from '@/entities/prerequisite'
import { mockPrograms, type Program } from '@/entities/program'

interface AddProgramCopyToMocksParams {
  program: Program
  prerequisites: ProgramPrerequisite[]
}

export const addProgramCopyToMocks = ({ program, prerequisites }: AddProgramCopyToMocksParams) => {
  mockPrograms.push(program)
  mockProgramPrerequisites.push(...prerequisites)
}
