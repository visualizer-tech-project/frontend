import { pluralize } from '@/shared/lib/pluralize'
import { Button } from '@/shared/ui/Button'
import Search from 'antd/es/input/Search'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './ProgramsFilters.module.css'

interface IProgramsFilters {
  searchValue: string
  filteredCount: number
  totalCount: number
  loadedCount?: number
  serverTotalCount?: number | null
  hasActiveFilters: boolean
  onSearchValueChange: (searchValue: string) => void
  searchPlaceholder?: string
  onBackClick?: () => void
  backLabel?: string
  isLoading?: boolean
  className?: string
}

export const ProgramsFilters: FC<IProgramsFilters> = ({
  searchValue,
  filteredCount,
  totalCount,
  loadedCount,
  serverTotalCount,
  hasActiveFilters,
  onSearchValueChange,
  searchPlaceholder = 'Поиск',
  onBackClick,
  backLabel = 'Назад',
  isLoading = false,
  className,
}) => {
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
        disabled={isLoading}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        onSearch={(value) => onSearchValueChange(value)}
      />

      <span className={styles.counter}>
        {isLoading
          ? 'Загрузка...'
          : `${filteredCount}${
              hasActiveFilters
                ? ` из ${totalCount} элементов`
                : ` ${pluralize(totalCount, ['элемент', 'элемента', 'элементов'])}`
            }${
              typeof serverTotalCount === 'number' && typeof loadedCount === 'number'
                ? `, загружено ${loadedCount} из ${serverTotalCount}`
                : ''
            }`}
      </span>
    </div>
  )
}
