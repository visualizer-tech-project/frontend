import { useProgramsActions, useProgramsState, useProgramsStore } from '@/features/programs'
import { useTracksActions, useTracksState, useTracksStore } from '@/features/tracks'
import { getTracksApiV1CareerTracksGet, getProgramsApiV1ProgramsGet } from '@/shared/api/generated'
import { getErrorMessage, notifyError } from '@/shared/lib/notify'
import { ProgramsGrid } from '@/widgets/programs'
import { TracksGrid } from '@/widgets/tracks'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './HomeContent.module.css'

export const HomeContent = () => {
  const { items: programs, limit: programsLimit } = useProgramsStore(useShallow(useProgramsState))
  const { appendItems: appendPrograms } = useProgramsStore(useShallow(useProgramsActions))
  const { items: tracks, limit: tracksLimit } = useTracksStore(useShallow(useTracksState))
  const { appendItems: appendTracks } = useTracksStore(useShallow(useTracksActions))
  const [isProgramsLoading, setIsProgramsLoading] = useState(programs.length === 0)
  const [isTracksLoading, setIsTracksLoading] = useState(tracks.length === 0)

  useEffect(() => {
    let isActive = true

    const loadHomeCatalogs = async () => {
      const shouldLoadPrograms = programs.length === 0
      const shouldLoadTracks = tracks.length === 0

      if (!shouldLoadPrograms && !shouldLoadTracks) {
        setIsProgramsLoading(false)
        setIsTracksLoading(false)
        return
      }

      setIsProgramsLoading(shouldLoadPrograms)
      setIsTracksLoading(shouldLoadTracks)

      try {
        const [programsResponse, tracksResponse] = await Promise.all([
          shouldLoadPrograms
            ? getProgramsApiV1ProgramsGet({
                query: {
                  limit: programsLimit,
                  skip: 0,
                },
              })
            : null,
          shouldLoadTracks
            ? getTracksApiV1CareerTracksGet({
                query: {
                  limit: tracksLimit,
                  skip: 0,
                },
              })
            : null,
        ])

        if (programsResponse?.error) {
          throw new Error(getErrorMessage(programsResponse.error, 'Не удалось загрузить программы.'))
        }

        if (tracksResponse?.error) {
          throw new Error(getErrorMessage(tracksResponse.error, 'Не удалось загрузить треки.'))
        }

        if (!isActive) {
          return
        }

        if (programsResponse?.data) {
          appendPrograms(programsResponse.data.items, programsResponse.data.items.length)
        }

        if (tracksResponse?.data) {
          appendTracks(tracksResponse.data.items, tracksResponse.data.info.total)
        }
      } catch (error) {
        if (isActive) {
          notifyError(
            'Не удалось загрузить каталог',
            getErrorMessage(error, 'Попробуйте обновить страницу.'),
          )
        }
      } finally {
        if (isActive) {
          setIsProgramsLoading(false)
          setIsTracksLoading(false)
        }
      }
    }

    loadHomeCatalogs()

    return () => {
      isActive = false
    }
  }, [appendPrograms, appendTracks, programs.length, programsLimit, tracks.length, tracksLimit])

  return (
    <div className={styles.root}>
      <section className={styles.block} aria-labelledby="home-programs-title">
        <div className={styles.blockHeader}>
          <span className={styles.eyebrow}>Каталог</span>
          <h2 id="home-programs-title">Учебные программы</h2>
        </div>

        <ProgramsGrid programs={programs} isLoading={isProgramsLoading} />
      </section>

      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>Следующий уровень</span>
        <span className={styles.dividerLine} />
      </div>

      <section className={styles.block} aria-labelledby="home-tracks-title">
        <div className={styles.blockHeader}>
          <span className={styles.eyebrow}>Траектории</span>
          <h2 id="home-tracks-title">Карьерные треки</h2>
        </div>

        <TracksGrid actionLabel="Открыть трек" tracks={tracks} isLoading={isTracksLoading} />
      </section>
    </div>
  )
}
