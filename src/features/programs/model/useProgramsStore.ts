import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IProgramsState {
  searchValue: string
}

export interface IProgramsActions {
  setSearchValue: (searchValue: string) => void
  resetFilters: () => void
}

type ProgramsStore = IProgramsState & IProgramsActions

const initialState: IProgramsState = {
  searchValue: '',
}

export const useProgramsStore = create<ProgramsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setSearchValue: (searchValue) => {
        set({ searchValue }, false, 'programsGrid/setSearchValue')
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
})

export const useProgramsActions = (state: ProgramsStore) => ({
  setSearchValue: state.setSearchValue,
  resetFilters: state.resetFilters,
})
