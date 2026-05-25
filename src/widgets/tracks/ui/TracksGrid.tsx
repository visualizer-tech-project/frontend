import { TrackCard, type CareerTrack } from '@/entities/track'
import { ProgramsFilters } from '@/features/programs'
import { useTracksActions, useTracksState, useTracksStore } from '@/features/tracks'
import { CatalogList } from '@/widgets/catalog'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './TracksGrid.module.css'

interface TracksGridProps {
  tracks: CareerTrack[]
  actionLabel?: string
  isLoading?: boolean
}

export const TracksGrid = ({
  tracks,
  actionLabel = 'Подробнее',
  isLoading = false,
}: TracksGridProps) => {
  const { searchValue } = useTracksStore(useShallow(useTracksState))
  const { setSearchValue } = useTracksStore(useShallow(useTracksActions))

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
        searchValue={searchValue}
        filteredCount={filteredTracks.length}
        totalCount={tracks.length}
        hasActiveFilters={Boolean(searchValue.trim())}
        onSearchValueChange={setSearchValue}
        searchPlaceholder="Поиск трека"
        isLoading={isLoading}
      />

      <CatalogList
        items={filteredTracks}
        getKey={(track) => track.id}
        renderItem={(track) => <TrackCard actionLabel={actionLabel} track={track} />}
        emptyDescription="Измените поисковый запрос, чтобы увидеть подходящие треки."
        isLoading={isLoading}
      />
    </div>
  )
}
