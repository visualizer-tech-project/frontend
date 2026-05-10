import type { Program } from '@/entities/program'
import {
  ProgramsFilters,
  ProgramsList,
  useProgramsState,
  useProgramsStore,
} from '@/features/programs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './ProgramsGrid.module.css'

interface ProgramsGridProps {
  programs: Program[]
  actionLabel?: string
  backLabel?: string
  backTo?: string
  onBack?: () => void
}

export const ProgramsGrid = ({
  programs,
  actionLabel = 'Подробнее',
  backLabel = 'Назад',
  backTo,
  onBack,
}: ProgramsGridProps) => {
  const navigate = useNavigate()

  const { searchValue } = useProgramsStore(useShallow(useProgramsState))

  const hasBackAction = Boolean(backTo || onBack)

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return programs.filter((program) => {
      const authorName = `${program.user.first_name} ${program.user.last_name}`.trim()

      return (
        !normalizedSearch ||
        [program.title, program.description ?? '', authorName, program.user.email]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      )
    })
  }, [programs, searchValue])

  const hasActiveFilters = Boolean(searchValue.trim())

  const handleBackClick = () => {
    if (onBack) {
      onBack()
      return
    }

    if (backTo) {
      navigate(backTo)
    }
  }

  return (
    <div className={styles.root}>
      <ProgramsFilters
        filteredCount={filteredPrograms.length}
        totalCount={programs.length}
        hasActiveFilters={hasActiveFilters}
        onBackClick={hasBackAction ? handleBackClick : undefined}
        backLabel={backLabel}
      />

      <ProgramsList programs={filteredPrograms} actionLabel={actionLabel} />
    </div>
  )
}
