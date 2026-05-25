import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ITracksState {
  searchValue: string
}

export interface ITracksActions {
  setSearchValue: (searchValue: string) => void
  resetFilters: () => void
}

type TracksStore = ITracksState & ITracksActions

const initialState: ITracksState = {
  searchValue: '',
}

export const useTracksStore = create<TracksStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setSearchValue: (searchValue) => {
        set({ searchValue }, false, 'tracksGrid/setSearchValue')
      },

      resetFilters: () => {
        set(initialState, false, 'tracksGrid/resetFilters')
      },
    }),
    {
      name: 'tracks-grid-store',
    },
  ),
)

export const useTracksState = (state: TracksStore) => ({
  searchValue: state.searchValue,
})

export const useTracksActions = (state: TracksStore) => ({
  setSearchValue: state.setSearchValue,
  resetFilters: state.resetFilters,
})
