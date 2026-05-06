import { Button } from '@/shared/ui/Button/Button'
import { Select } from 'antd'
import Search from 'antd/es/input/Search'
import type { DefaultOptionType } from 'antd/es/select'
import clsx from 'clsx'
import type { FC } from 'react'
import { useShallow } from 'zustand/shallow'
import type { AdmissionYearFilter, StudyModeFilter } from '../../model/types'
import {
  useProgramsActions,
  useProgramsState,
  useProgramsStore,
} from '../../model/useProgramsStore'
import styles from './ProgramsFilters.module.css'

interface IProgramsFilters {
  admissionYearOptions: DefaultOptionType[]
  studyModeOptions: DefaultOptionType[]

  filteredCount: number
  totalCount: number
  hasActiveFilters: boolean

  onBackClick?: () => void
  backLabel?: string
  className?: string
}

export const ProgramsFilters: FC<IProgramsFilters> = ({
  admissionYearOptions,
  studyModeOptions,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onBackClick,
  backLabel,
  className,
}) => {
  const { searchValue, studyModeFilter, admissionYearFilter } = useProgramsStore(
    useShallow(useProgramsState),
  )

  const { setSearchValue, setStudyModeFilter, setAdmissionYearFilter } = useProgramsStore(
    useShallow(useProgramsActions),
  )

  return (
    <div className={clsx(styles.toolbar, onBackClick && styles.toolbarWithBack, className)}>
      {onBackClick ? (
        <Button
          className={styles.backAction}
          color="default"
          htmlType="button"
          variant="text"
          onClick={onBackClick}
        >
          {backLabel || 'Вернуться назад'}
        </Button>
      ) : null}

      <Search
        allowClear
        className={styles.search}
        enterButton="Найти"
        placeholder="Поиск программы"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onSearch={(value) => setSearchValue(value)}
      />

      <Select
        className={styles.filterSelect}
        classNames={{
          popup: {
            root: styles.filterDropdown,
          },
        }}
        value={studyModeFilter}
        options={studyModeOptions}
        onChange={(value) => setStudyModeFilter(value as StudyModeFilter)}
      />

      <Select
        className={styles.filterSelect}
        classNames={{
          popup: {
            root: styles.filterDropdown,
          },
        }}
        value={admissionYearFilter}
        options={admissionYearOptions}
        onChange={(value) => setAdmissionYearFilter(value as AdmissionYearFilter)}
      />

      <span className={styles.counter}>
        {filteredCount}
        {hasActiveFilters ? ` из ${totalCount}` : ''} программ
      </span>
    </div>
  )
}
