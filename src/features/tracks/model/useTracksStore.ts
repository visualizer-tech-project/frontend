import type { CareerTrack } from '@/entities/track'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const DEFAULT_TRACKS_LIMIT = 8

export interface ITracksState {
  items: CareerTrack[]
  limit: number
  loadedCount: number
  searchValue: string
  totalCount: number | null
}

export interface ITracksActions {
  appendItems: (items: CareerTrack[], totalCount: number) => void
  replaceItems: (items: CareerTrack[], totalCount: number) => void
  removeItem: (trackId: CareerTrack['id']) => void
  resetCatalog: () => void
  setSearchValue: (searchValue: string) => void
  setLimit: (limit: number) => void
  upsertItem: (track: CareerTrack) => void
  resetFilters: () => void
}

type TracksStore = ITracksState & ITracksActions

const initialState: ITracksState = {
  items: [],
  limit: DEFAULT_TRACKS_LIMIT,
  loadedCount: 0,
  searchValue: '',
  totalCount: null,
}

const mergeUniqueTracks = (currentItems: CareerTrack[], nextItems: CareerTrack[]) => {
  const result = [...currentItems]

  nextItems.forEach((track) => {
    const existingIndex = result.findIndex((item) => item.id === track.id)

    if (existingIndex >= 0) {
      result[existingIndex] = track
      return
    }

    result.push(track)
  })

  return result
}

export const useTracksStore = create<TracksStore>()(
  devtools(
    (set) => ({
      ...initialState,

      appendItems: (items, totalCount) => {
        set(
          (state) => {
            const nextItems = mergeUniqueTracks(state.items, items)

            return {
              items: nextItems,
              loadedCount: nextItems.length,
              totalCount,
            }
          },
          false,
          'tracksGrid/appendItems',
        )
      },

      replaceItems: (items, totalCount) => {
        set(
          {
            items,
            loadedCount: items.length,
            totalCount,
          },
          false,
          'tracksGrid/replaceItems',
        )
      },

      removeItem: (trackId) => {
        set(
          (state) => {
            const nextItems = state.items.filter((track) => track.id !== trackId)

            return {
              items: nextItems,
              loadedCount: nextItems.length,
              totalCount:
                typeof state.totalCount === 'number' ? Math.max(state.totalCount - 1, 0) : null,
            }
          },
          false,
          'tracksGrid/removeItem',
        )
      },

      resetCatalog: () => {
        set(
          {
            items: [],
            limit: initialState.limit,
            loadedCount: 0,
            totalCount: null,
          },
          false,
          'tracksGrid/resetCatalog',
        )
      },

      setSearchValue: (searchValue) => {
        set({ searchValue }, false, 'tracksGrid/setSearchValue')
      },

      setLimit: (limit) => {
        set({ limit }, false, 'tracksGrid/setLimit')
      },

      upsertItem: (track) => {
        set(
          (state) => {
            const nextItems = mergeUniqueTracks(state.items, [track])

            return {
              items: nextItems,
              loadedCount: nextItems.length,
              totalCount:
                typeof state.totalCount === 'number'
                  ? Math.max(state.totalCount, nextItems.length)
                  : nextItems.length,
            }
          },
          false,
          'tracksGrid/upsertItem',
        )
      },

      resetFilters: () => {
        set({ searchValue: initialState.searchValue }, false, 'tracksGrid/resetFilters')
      },
    }),
    {
      name: 'tracks-grid-store',
    },
  ),
)

export const useTracksState = (state: TracksStore) => ({
  items: state.items,
  limit: state.limit,
  loadedCount: state.loadedCount,
  searchValue: state.searchValue,
  totalCount: state.totalCount,
  isFullyLoaded:
    typeof state.totalCount === 'number' ? state.loadedCount >= state.totalCount : false,
})

export const useTracksActions = (state: TracksStore) => ({
  appendItems: state.appendItems,
  replaceItems: state.replaceItems,
  removeItem: state.removeItem,
  resetCatalog: state.resetCatalog,
  setSearchValue: state.setSearchValue,
  setLimit: state.setLimit,
  upsertItem: state.upsertItem,
  resetFilters: state.resetFilters,
})
