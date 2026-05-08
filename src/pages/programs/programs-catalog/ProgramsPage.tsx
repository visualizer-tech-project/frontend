import { mockPrograms } from '@/entities/program'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button/Button'
import { ProgramsGrid } from '@/widgets/programs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './ProgramsPage.module.css'

export const ProgramsPage = () => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const canAddProgram = user?.role === Roles.TEACHER || user?.role === Roles.ADMIN
  const authorsCount = useMemo(
    () => new Set(mockPrograms.map((program) => program.user_id)).size,
    [],
  )
  const latestUpdate = useMemo(
    () =>
      mockPrograms
        .map((program) => program.updated_at)
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
            <p className={styles.eyebrow}>Каталог программ</p>
            <h1 className={styles.title}>Образовательные программы</h1>
            <p className={styles.description}>
              Выбирайте направление и открывайте граф программы, чтобы посмотреть структуру
              дисциплин, связи между курсами и автора программы.
            </p>
          </div>

          <div className={styles.heroAside}>
            <dl className={styles.stats}>
              <div className={styles.statItem}>
                <dt>Всего</dt>
                <dd>{mockPrograms.length}</dd>
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
                  Создать программу
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <section className={styles.catalog} aria-labelledby="programs-title">
          <div className={styles.catalogHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Список</p>
              <h2 id="programs-title" className={styles.sectionTitle}>
                Все программы
              </h2>
            </div>
            <p>Поиск учитывает название программы, описание и имя автора.</p>
          </div>

          <ProgramsGrid actionLabel="Открыть граф" programs={mockPrograms} />
        </section>
      </div>
    </section>
  )
}
