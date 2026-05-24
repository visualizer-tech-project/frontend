import { ProgramCard, type Program } from '@/entities/program'
import {
  ProgramsFilters,
  useProgramsActions,
  useProgramsState,
  useProgramsStore,
} from '@/features/programs'
import { CatalogList } from '@/widgets/catalog'
import clsx from 'clsx'
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
  surface?: 'default' | 'transparent'
  isLoading?: boolean
}

export const ProgramsGrid = ({
  programs,
  actionLabel = 'Подробнее',
  backLabel = 'Назад',
  backTo,
  onBack,
  surface = 'default',
  isLoading = false,
}: ProgramsGridProps) => {
  const navigate = useNavigate()
  const { searchValue } = useProgramsStore(useShallow(useProgramsState))
  const { setSearchValue } = useProgramsStore(useShallow(useProgramsActions))
  const hasBackAction = Boolean(backTo || onBack)

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return programs.filter((program) => {
      if (!normalizedSearch) {
        return true
      }

      return [
        program.title,
        program.description ?? '',
        program.user.first_name,
        program.user.last_name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [programs, searchValue])

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
    <div className={clsx(styles.root, surface === 'transparent' && styles.rootTransparent)}>
      <ProgramsFilters
        searchValue={searchValue}
        filteredCount={filteredPrograms.length}
        totalCount={programs.length}
        hasActiveFilters={Boolean(searchValue.trim())}
        onSearchValueChange={setSearchValue}
        onBackClick={hasBackAction ? handleBackClick : undefined}
        backLabel={backLabel}
        searchPlaceholder="Поиск программы"
        isLoading={isLoading}
      />

      <CatalogList
        items={filteredPrograms}
        getKey={(program) => program.id}
        renderItem={(program) => <ProgramCard actionLabel={actionLabel} program={program} />}
        emptyDescription="Измените поисковый запрос, чтобы увидеть подходящие программы."
        isLoading={isLoading}
      />
    </div>
  )
}
