import { CreateTrackButton } from '@/features/track-create'
import { useTracksActions, useTracksState, useTracksStore } from '@/features/tracks'
import { getTracksApiV1CareerTracksGet } from '@/shared/api/generated'
import { getErrorMessage, notifyError } from '@/shared/lib/notify'
import { PageHero } from '@/widgets/page-hero'
import { TracksGrid } from '@/widgets/tracks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './TracksPage.module.css'

export const TracksPage = () => {
  const { items: tracks, isFullyLoaded, limit, loadedCount, searchValue, totalCount } =
    useTracksStore(useShallow(useTracksState))
  const { appendItems, replaceItems } = useTracksStore(useShallow(useTracksActions))
  const [isTracksLoading, setIsTracksLoading] = useState(tracks.length === 0)
  const [isMoreLoading, setIsMoreLoading] = useState(false)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue)
  const [hasLoadFailed, setHasLoadFailed] = useState(false)
  const activeTracksRequestKeyRef = useRef<string | null>(null)
  const isLoadErrorNotificationShownRef = useRef(false)
  const authorsCount = useMemo(() => new Set(tracks.map((track) => track.user_id)).size, [tracks])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchValue])

  const loadTracks = useCallback(
    async (skip: number, search = debouncedSearchValue) => {
      const normalizedSearch = search.trim()
      const requestKey = `${skip}:${normalizedSearch}`

      if (activeTracksRequestKeyRef.current === requestKey) {
        return
      }

      activeTracksRequestKeyRef.current = requestKey
      const isInitialLoading = skip === 0
      setIsTracksLoading(isInitialLoading)
      setIsMoreLoading(!isInitialLoading)

      try {
        const { data, error } = await getTracksApiV1CareerTracksGet({
          query: {
            limit,
            skip,
            title: normalizedSearch || undefined,
          },
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось загрузить треки.'))
        }

        const items = data?.items ?? []
        const nextTotalCount = items.length < limit ? skip + items.length : (data?.info.total ?? 0)

        if (isInitialLoading) {
          replaceItems(items, nextTotalCount)
        } else {
          appendItems(items, nextTotalCount)
        }

        setHasLoadFailed(false)
        isLoadErrorNotificationShownRef.current = false
      } catch (error) {
        setHasLoadFailed(true)
        if (isInitialLoading) {
          replaceItems([], 0)
        }

        if (!isLoadErrorNotificationShownRef.current) {
          notifyError(
            'Не удалось загрузить треки',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
          isLoadErrorNotificationShownRef.current = true
        }
      } finally {
        if (activeTracksRequestKeyRef.current === requestKey) {
          activeTracksRequestKeyRef.current = null
        }
        setIsTracksLoading(false)
        setIsMoreLoading(false)
      }
    },
    [appendItems, debouncedSearchValue, limit, replaceItems],
  )

  useEffect(() => {
    loadTracks(0, debouncedSearchValue)
  }, [debouncedSearchValue, loadTracks])

  const hasMoreTracks =
    !hasLoadFailed && !isFullyLoaded && loadedCount >= limit && tracks.length >= limit

  const latestUpdate = useMemo(
    () =>
      tracks
        .map((track) => track.updated_at)
        .sort()
        .at(-1)
        ?.slice(0, 10) ?? '—',
    [tracks],
  )

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <PageHero
          eyebrow="Каталог карьерных треков"
          title="Карьерные треки"
          description="Треки объединяют программы и курсы по карьерным направлениям. Используйте поиск, чтобы быстро найти нужную траекторию."
          statsLabel="Статистика треков"
          stats={[
            {
              label: 'Всего',
              value: tracks.length,
            },
            {
              label: 'Авторов',
              value: authorsCount,
            },
            {
              label: 'Обновлено',
              value: latestUpdate,
            },
          ]}
        >
          <CreateTrackButton>Создать трек</CreateTrackButton>
        </PageHero>

        <section className={styles.catalog} aria-labelledby="tracks-title">
          <div className={styles.catalogHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Список</p>
              <h2 id="tracks-title" className={styles.sectionTitle}>
                Все треки
              </h2>
            </div>

            <p>Поиск работает по названию трека и использует параметры API.</p>
          </div>

          <TracksGrid
            actionLabel="Открыть трек"
            tracks={tracks}
            isLoading={isTracksLoading}
            isMoreLoading={isMoreLoading}
            loadedCount={loadedCount}
            totalCount={totalCount}
            hasMore={hasMoreTracks}
            onLoadMore={() => loadTracks(loadedCount)}
          />
        </section>
      </div>
    </section>
  )
}
