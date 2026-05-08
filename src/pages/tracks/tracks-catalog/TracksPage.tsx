import { mockTracks } from '@/entities/track'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button/Button'
import { TracksGrid } from '@/widgets/tracks'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './ProgramsPage.module.css'

export const TracksPage = () => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const canAddProgram = user?.role === Roles.TEACHER || user?.role === Roles.ADMIN
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
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Каталог карьерных треков</p>
            <h1 className={styles.title}>Карьерные треки</h1>
            <p className={styles.description}>
              Треки объединяют программы и курсы по карьерным направлениям. Используйте поиск, чтобы
              быстро найти нужную траекторию.
            </p>
          </div>

          <div className={styles.heroAside}>
            <dl className={styles.stats}>
              <div className={styles.statItem}>
                <dt>Всего</dt>
                <dd>{mockTracks.length}</dd>
              </div>
              <div className={styles.statItem}>
                <dt>Авторов</dt>
                <dd>{authorsCount}</dd>
              </div>
              <div className={styles.statItem}>
                <dt>Обновлено</dt>
                <dd>{latestUpdate}</dd>
              </div>
            </dl>

            {canAddProgram ? (
              <div className={styles.actions}>
                <Button
                  color="default"
                  htmlType="button"
                  variant="solid"
                  onClick={() => navigate(ROUTES.ADD_PROGRAM)}
                >
                  Создать трек
                </Button>
              </div>
            ) : null}
          </div>
        </header>

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

          <TracksGrid actionLabel="Открыть трек" tracks={mockTracks} />
        </section>
      </div>
    </section>
  )
}
