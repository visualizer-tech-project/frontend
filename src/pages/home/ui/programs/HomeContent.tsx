import { mockPrograms } from '@/entities/program'
import { mockTracks } from '@/entities/track'
import { useMockLoading } from '@/shared/lib/useMockLoading'
import { ProgramsGrid } from '@/widgets/programs'
import { TracksGrid } from '@/widgets/tracks'
import styles from './HomeContent.module.css'

export const HomeContent = () => {
  const isProgramsLoading = useMockLoading()
  const isTracksLoading = useMockLoading()

  return (
    <div className={styles.root}>
      <section className={styles.block} aria-labelledby="home-programs-title">
        <div className={styles.blockHeader}>
          <span className={styles.eyebrow}>Каталог</span>
          <h2 id="home-programs-title">Учебные программы</h2>
        </div>

        <ProgramsGrid programs={mockPrograms} isLoading={isProgramsLoading} />
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

        <TracksGrid actionLabel="Открыть трек" tracks={mockTracks} isLoading={isTracksLoading} />
      </section>
    </div>
  )
}
