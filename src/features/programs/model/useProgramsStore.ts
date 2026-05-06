import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AdmissionYearFilter, StudyModeFilter } from './types'

export interface IProgramsState {
  searchValue: string
  studyModeFilter: StudyModeFilter
  admissionYearFilter: AdmissionYearFilter
}

export interface IProgramsActions {
  setSearchValue: (searchValue: string) => void
  setStudyModeFilter: (studyModeFilter: StudyModeFilter) => void
  setAdmissionYearFilter: (admissionYearFilter: AdmissionYearFilter) => void
  resetFilters: () => void
}

type ProgramsStore = IProgramsState & IProgramsActions

const initialState: IProgramsState = {
  searchValue: '',
  studyModeFilter: 'all',
  admissionYearFilter: 'all',
}

export const useProgramsStore = create<ProgramsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setSearchValue: (searchValue) => {
        set({ searchValue }, false, 'programsGrid/setSearchValue')
      },

      setStudyModeFilter: (studyModeFilter) => {
        set({ studyModeFilter }, false, 'programsGrid/setStudyModeFilter')
      },

      setAdmissionYearFilter: (admissionYearFilter) => {
        set({ admissionYearFilter }, false, 'programsGrid/setAdmissionYearFilter')
      },

      resetFilters: () => {
        set(initialState, false, 'programsGrid/resetFilters')
      },
    }),
    {
      name: 'programs-grid-store',
    },
  ),
)

export const useProgramsState = (state: ProgramsStore) => ({
  searchValue: state.searchValue,
  studyModeFilter: state.studyModeFilter,
  admissionYearFilter: state.admissionYearFilter,
})

export const useProgramsActions = (state: ProgramsStore) => ({
  setSearchValue: state.setSearchValue,
  setStudyModeFilter: state.setStudyModeFilter,
  setAdmissionYearFilter: state.setAdmissionYearFilter,
  resetFilters: state.resetFilters,
})
