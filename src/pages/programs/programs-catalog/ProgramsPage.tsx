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
  const admissionYears = useMemo(
    () =>
      [...new Set(mockPrograms.map((program) => program.admission_year))].sort(
        (currentYear, nextYear) => currentYear - nextYear,
      ),
    [],
  )
  const yearsLabel =
    admissionYears.length > 1
      ? `${admissionYears.at(0)}-${admissionYears.at(-1)}`
      : `${admissionYears.at(0) ?? '—'}`
  const studyModesCount = new Set(mockPrograms.map((program) => program.study_mode)).size

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Каталог программ</p>
            <h1 className={styles.title}>Образовательные программы</h1>
            <p className={styles.description}>
              Выбирайте направление, сравнивайте формат обучения и открывайте граф программы, чтобы
              увидеть структуру дисциплин и связи между ними.
            </p>
          </div>

          <div className={styles.heroAside}>
            <dl className={styles.stats}>
              <div className={styles.statItem}>
                <dt>Всего</dt>
                <dd>{mockPrograms.length}</dd>
              </div>
              <div className={styles.statItem}>
                <dt>Годы набора</dt>
                <dd>{yearsLabel}</dd>
              </div>
              <div className={styles.statItem}>
                <dt>Форматы</dt>
                <dd>{studyModesCount}</dd>
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
            <p>
              Фильтры построены по полям спецификации программы: формат обучения и год набора. Поиск
              также учитывает название, описание и метки карточек.
            </p>
          </div>

          <ProgramsGrid actionLabel="Открыть граф" programs={mockPrograms} />
        </section>
      </div>
    </section>
  )
}
