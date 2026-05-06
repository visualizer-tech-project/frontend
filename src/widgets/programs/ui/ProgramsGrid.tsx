import { studyModeLabels, type Program } from '@/entities/program'
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

  const { searchValue, studyModeFilter, admissionYearFilter } = useProgramsStore(
    useShallow(useProgramsState),
  )

  const hasBackAction = Boolean(backTo || onBack)

  const admissionYears = useMemo(
    () =>
      [...new Set(programs.map((program) => program.admission_year))].sort(
        (currentYear, nextYear) => nextYear - currentYear,
      ),
    [programs],
  )

  const studyModeOptions = useMemo(
    () => [
      { label: 'Все форматы', value: 'all' },
      { label: studyModeLabels['full-time'], value: 'full-time' },
      { label: studyModeLabels['part-time'], value: 'part-time' },
    ],
    [],
  )

  const admissionYearOptions = useMemo(
    () => [
      { label: 'Все годы', value: 'all' },
      ...admissionYears.map((year) => ({
        label: `${year} год`,
        value: String(year),
      })),
    ],
    [admissionYears],
  )

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          program.title,
          program.description ?? '',
          studyModeLabels[program.study_mode],
          `${program.admission_year}`,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesStudyMode = studyModeFilter === 'all' || program.study_mode === studyModeFilter

      const matchesAdmissionYear =
        admissionYearFilter === 'all' || program.admission_year === Number(admissionYearFilter)

      return matchesSearch && matchesStudyMode && matchesAdmissionYear
    })
  }, [admissionYearFilter, programs, searchValue, studyModeFilter])

  const hasActiveFilters =
    Boolean(searchValue.trim()) || studyModeFilter !== 'all' || admissionYearFilter !== 'all'

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
        admissionYearOptions={admissionYearOptions}
        studyModeOptions={studyModeOptions}
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
