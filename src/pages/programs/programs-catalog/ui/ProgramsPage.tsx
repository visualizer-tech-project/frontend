import { mockPrograms } from '@/entities/program'
import { Roles, useUserState, useUserStore } from '@/entities/user'
import { CreateProgramButton } from '@/features/program-create'
import { ImportProgramButton } from '@/features/program-import'
import { useMockLoading } from '@/shared/lib/useMockLoading'
import { PageHero } from '@/widgets/page-hero'
import { ProgramsGrid } from '@/widgets/programs'
import { useShallow } from 'zustand/shallow'
import styles from './ProgramsPage.module.css'

export const ProgramsPage = () => {
  const { user } = useUserStore(useShallow(useUserState))
  const isProgramsLoading = useMockLoading()

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <PageHero
          description="Выбирайте направление, сравнивайте формат обучения и открывайте граф программы, чтобы увидеть структуру дисциплин и связи между ними."
          eyebrow="Каталог программ"
          title="Образовательные программы"
        >
          {user?.role === Roles.TEACHER || user?.role === Roles.ADMIN ? (
            <div className={styles.heroActions}>
              <CreateProgramButton>Создать программу</CreateProgramButton>
              <ImportProgramButton>Импорт Excel/CSV</ImportProgramButton>
            </div>
          ) : null}
        </PageHero>

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

          <ProgramsGrid
            actionLabel="Открыть граф"
            programs={mockPrograms}
            isLoading={isProgramsLoading}
          />
        </section>
      </div>
    </section>
  )
}
