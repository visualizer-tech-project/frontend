import { mockTracks } from '@/entities/track'
import { CreateTrackButton } from '@/features/track-create'
import { useMockLoading } from '@/shared/lib/useMockLoading'
import { PageHero } from '@/widgets/page-hero'
import { TracksGrid } from '@/widgets/tracks'
import { useMemo } from 'react'
import styles from './TracksPage.module.css'

export const TracksPage = () => {
  const isTracksLoading = useMockLoading()
  const authorsCount = useMemo(() => new Set(mockTracks.map((track) => track.user_id)).size, [])

  const latestUpdate = useMemo(
    () =>
      mockTracks
        .map((track) => track.updated_at)
        .sort()
        .at(-1)
        ?.slice(0, 10) ?? '—',
    [],
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
              value: mockTracks.length,
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

            <p>Поиск учитывает название трека, описание и имя автора.</p>
          </div>

          <TracksGrid actionLabel="Открыть трек" tracks={mockTracks} isLoading={isTracksLoading} />
        </section>
      </div>
    </section>
  )
}
