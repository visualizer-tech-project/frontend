import { mockPrograms } from '@/entities/program'
import { ROUTES } from '@/shared/config'
import { NavLink, useParams } from 'react-router-dom'
import { ProgramWorkspace } from './ProgramWorkspace'

export const ProgramDetailsPage = () => {
  const { programId } = useParams()
  const numericProgramId = Number(programId)
  const program = mockPrograms.find(({ id }) => id === numericProgramId)

  if (!program || Number.isNaN(numericProgramId)) return <NavLink to={ROUTES.NOT_FOUND} />

  return (
    <ProgramWorkspace
      heading={program.title}
      program={program}
      subtitle={`${program.description ?? 'Описание пока не добавлено.'} Год набора: ${program.admission_year}.`}
    />
  )
}
