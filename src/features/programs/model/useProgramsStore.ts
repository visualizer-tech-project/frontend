import type { Program } from '@/entities/program'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const DEFAULT_PROGRAMS_LIMIT = 8

export interface IProgramsState {
  items: Program[]
  limit: number
  loadedCount: number
  searchValue: string
  totalCount: number | null
}

export interface IProgramsActions {
  appendItems: (items: Program[], totalCount: number) => void
  replaceItems: (items: Program[], totalCount: number) => void
  removeItem: (programId: Program['id']) => void
  resetCatalog: () => void
  setSearchValue: (searchValue: string) => void
  setLimit: (limit: number) => void
  upsertItem: (program: Program) => void
  resetFilters: () => void
}

type ProgramsStore = IProgramsState & IProgramsActions

const initialState: IProgramsState = {
  items: [],
  limit: DEFAULT_PROGRAMS_LIMIT,
  loadedCount: 0,
  searchValue: '',
  totalCount: null,
}

const mergeUniquePrograms = (currentItems: Program[], nextItems: Program[]) => {
  const result = [...currentItems]

  nextItems.forEach((program) => {
    const existingIndex = result.findIndex((item) => item.id === program.id)

    if (existingIndex >= 0) {
      result[existingIndex] = program
      return
    }

    result.push(program)
  })

  return result
}

export const useProgramsStore = create<ProgramsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      appendItems: (items, totalCount) => {
        set(
          (state) => {
            const nextItems = mergeUniquePrograms(state.items, items)

            return {
              items: nextItems,
              loadedCount: nextItems.length,
              totalCount,
            }
          },
          false,
          'programsGrid/appendItems',
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
          'programsGrid/replaceItems',
        )
      },

      removeItem: (programId) => {
        set(
          (state) => {
            const nextItems = state.items.filter((program) => program.id !== programId)

            return {
              items: nextItems,
              loadedCount: nextItems.length,
              totalCount:
                typeof state.totalCount === 'number' ? Math.max(state.totalCount - 1, 0) : null,
            }
          },
          false,
          'programsGrid/removeItem',
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
          'programsGrid/resetCatalog',
        )
      },

      setSearchValue: (searchValue) => {
        set({ searchValue }, false, 'programsGrid/setSearchValue')
      },

      setLimit: (limit) => {
        set({ limit }, false, 'programsGrid/setLimit')
      },

      upsertItem: (program) => {
        set(
          (state) => {
            const nextItems = mergeUniquePrograms(state.items, [program])

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
          'programsGrid/upsertItem',
        )
      },

      resetFilters: () => {
        set({ searchValue: initialState.searchValue }, false, 'programsGrid/resetFilters')
      },
    }),
    {
      name: 'programs-grid-store',
    },
  ),
)

export const useProgramsState = (state: ProgramsStore) => ({
  items: state.items,
  limit: state.limit,
  loadedCount: state.loadedCount,
  searchValue: state.searchValue,
  totalCount: state.totalCount,
  isFullyLoaded:
    typeof state.totalCount === 'number' ? state.loadedCount >= state.totalCount : false,
})

export const useProgramsActions = (state: ProgramsStore) => ({
  appendItems: state.appendItems,
  replaceItems: state.replaceItems,
  removeItem: state.removeItem,
  resetCatalog: state.resetCatalog,
  setSearchValue: state.setSearchValue,
  setLimit: state.setLimit,
  upsertItem: state.upsertItem,
  resetFilters: state.resetFilters,
})
