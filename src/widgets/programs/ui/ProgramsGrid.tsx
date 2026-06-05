import { ProgramCard, type Program } from '@/entities/program'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { ProgramCopyButton } from '@/features/program-copy'
import { DeleteProgramButton } from '@/features/program-delete'
import {
  ProgramsFilters,
  useProgramsActions,
  useProgramsState,
  useProgramsStore,
} from '@/features/programs'
import { Button } from '@/shared/ui/Button'
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
  hasMore?: boolean
  onBack?: () => void
  onLoadMore?: () => void
  surface?: 'default' | 'transparent'
  isLoading?: boolean
  isMoreLoading?: boolean
  loadedCount?: number
  totalCount?: number | null
}

export const ProgramsGrid = ({
  programs,
  actionLabel = 'Подробнее',
  backLabel = 'Назад',
  backTo,
  hasMore = false,
  onBack,
  onLoadMore,
  surface = 'default',
  isLoading = false,
  isMoreLoading = false,
  loadedCount = programs.length,
  totalCount = null,
}: ProgramsGridProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { searchValue } = useProgramsStore(useShallow(useProgramsState))
  const { setSearchValue } = useProgramsStore(useShallow(useProgramsActions))
  const hasBackAction = Boolean(backTo || onBack)
  const canCopyPrograms = user?.role === Roles.TEACHER || user?.role === Roles.ADMIN

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
        loadedCount={loadedCount}
        serverTotalCount={totalCount}
        hasActiveFilters={Boolean(searchValue.trim())}
        onSearchValueChange={setSearchValue}
        onBackClick={hasBackAction ? handleBackClick : undefined}
        backLabel={backLabel}
        searchPlaceholder="Поиск программы"
        isLoading={isLoading}
      />

      <CatalogList
        items={filteredPrograms}
        getKey={(program) => program.id ?? window.crypto.randomUUID()}
        renderItem={(program) => (
          <ProgramCard actionLabel={actionLabel} program={program}>
            <DeleteProgramButton program={program} />
            {canCopyPrograms ? <ProgramCopyButton program={program} /> : null}
          </ProgramCard>
        )}
        emptyDescription="Измените поисковый запрос, чтобы увидеть подходящие программы."
        isLoading={isLoading}
      />

      {hasMore && onLoadMore ? (
        <div className={styles.loadMoreRow}>
          <Button
            className={styles.loadMoreButton}
            disabled={isLoading || isMoreLoading}
            htmlType="button"
            onClick={onLoadMore}
          >
            {isMoreLoading ? 'Загружаем...' : 'Загрузить еще'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
