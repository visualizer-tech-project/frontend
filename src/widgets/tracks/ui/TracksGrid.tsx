import { TrackCard, type CareerTrack } from '@/entities/track'
import { ProgramsFilters, useProgramsState, useProgramsStore } from '@/features/programs'
import { CatalogList } from '@/widgets/catalog'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './TracksGrid.module.css'

interface TracksGridProps {
  tracks: CareerTrack[]
  actionLabel?: string
}

export const TracksGrid = ({ tracks, actionLabel = 'Подробнее' }: TracksGridProps) => {
  const { searchValue } = useProgramsStore(useShallow(useProgramsState))

  const filteredTracks = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return tracks.filter((track) => {
      if (!normalizedSearch) {
        return true
      }

      return [track.title, track.description ?? '', track.user.first_name, track.user.last_name]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [searchValue, tracks])

  return (
    <div className={styles.root}>
      <ProgramsFilters
        filteredCount={filteredTracks.length}
        totalCount={tracks.length}
        hasActiveFilters={Boolean(searchValue.trim())}
        searchPlaceholder="Поиск трека"
      />

      <CatalogList
        items={filteredTracks}
        getKey={(track) => track.id}
        renderItem={(track) => <TrackCard actionLabel={actionLabel} track={track} />}
        emptyDescription="Измените поисковый запрос, чтобы увидеть подходящие треки."
      />
    </div>
  )
}
