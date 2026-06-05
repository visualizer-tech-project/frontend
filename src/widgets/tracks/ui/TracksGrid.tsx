import { TrackCard, type CareerTrack } from '@/entities/track'
import { ProgramsFilters } from '@/features/programs'
import { DeleteTrackButton } from '@/features/track-delete'
import { useTracksActions, useTracksState, useTracksStore } from '@/features/tracks'
import { Button } from '@/shared/ui/Button'
import { CatalogList } from '@/widgets/catalog'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './TracksGrid.module.css'

interface TracksGridProps {
  tracks: CareerTrack[]
  actionLabel?: string
  hasMore?: boolean
  isLoading?: boolean
  isMoreLoading?: boolean
  loadedCount?: number
  onLoadMore?: () => void
  totalCount?: number | null
}

export const TracksGrid = ({
  tracks,
  actionLabel = 'Подробнее',
  hasMore = false,
  isLoading = false,
  isMoreLoading = false,
  loadedCount = tracks.length,
  onLoadMore,
  totalCount = null,
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
        loadedCount={loadedCount}
        serverTotalCount={totalCount}
        hasActiveFilters={Boolean(searchValue.trim())}
        onSearchValueChange={setSearchValue}
        searchPlaceholder="Поиск трека"
        isLoading={isLoading}
      />

      <CatalogList
        items={filteredTracks}
        getKey={(track) => track.id ?? window.crypto.randomUUID()}
        renderItem={(track) => (
          <TrackCard actionLabel={actionLabel} track={track}>
            <DeleteTrackButton track={track} />
          </TrackCard>
        )}
        emptyDescription="Измените поисковый запрос, чтобы увидеть подходящие треки."
        isLoading={isLoading}
      />

      {hasMore && onLoadMore ? (
        <div className={styles.loadMoreRow}>
          <Button
            className={styles.loadMoreButton}
            disabled={isLoading || isMoreLoading}
            htmlType="button"
            onClick={onLoadMore}
          >
            {isMoreLoading ? 'Загружаем...' : 'Загрузить еще'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
