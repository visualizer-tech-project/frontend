import { pluralize } from '@/shared/lib/pluralize'
import { Button } from '@/shared/ui/Button'
import Search from 'antd/es/input/Search'
import clsx from 'clsx'
import type { FC } from 'react'
import { useShallow } from 'zustand/shallow'
import {
  useProgramsActions,
  useProgramsState,
  useProgramsStore,
} from '../../model/useProgramsStore'
import styles from './ProgramsFilters.module.css'

interface IProgramsFilters {
  filteredCount: number
  totalCount: number
  hasActiveFilters: boolean
  searchPlaceholder?: string
  onBackClick?: () => void
  backLabel?: string
  className?: string
}

export const ProgramsFilters: FC<IProgramsFilters> = ({
  filteredCount,
  totalCount,
  hasActiveFilters,
  searchPlaceholder = 'Поиск',
  onBackClick,
  backLabel = 'Назад',
  className,
}) => {
  const { searchValue } = useProgramsStore(useShallow(useProgramsState))
  const { setSearchValue } = useProgramsStore(useShallow(useProgramsActions))
  const hasBackAction = Boolean(onBackClick)

  return (
    <div className={clsx(styles.toolbar, hasBackAction && styles.toolbarWithBack, className)}>
      {hasBackAction && (
        <Button className={styles.backAction} onClick={onBackClick}>
          {backLabel}
        </Button>
      )}

      <Search
        allowClear
        className={styles.search}
        enterButton="Найти"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onSearch={(value) => setSearchValue(value)}
      />

      <span className={styles.counter}>
        {filteredCount}
        {hasActiveFilters
          ? ` из ${totalCount} элементов`
          : ` ${pluralize(totalCount, ['элемент', 'элемента', 'элементов'])}`}
      </span>
    </div>
  )
}
