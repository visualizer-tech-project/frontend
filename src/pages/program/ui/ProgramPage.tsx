import { ProgramsGrid, mockPrograms } from '@/entities/program'
import { ROUTES } from '@/shared/config'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './ProgramPage.module.css'

export const ProgramPage = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredPrograms = mockPrograms.filter((program) => {
    if (!normalizedSearch) {
      return true
    }

    return `${program.title} ${program.description}`.toLowerCase().includes(normalizedSearch)
  })

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Каталог</p>
            <h1 className={styles.title}>Программы обучения</h1>
          </div>

          <p className={styles.description}>
            Контент из my-app - Copy встроен в слой pages/program: каталог программ теперь живёт
            рядом с конструктором и общей навигацией текущего frontend.
          </p>

          <div className={styles.actions}>
            <Link className={styles.secondaryAction} to={ROUTES.HOME}>
              На главную
            </Link>
            <Link className={styles.primaryAction} to={ROUTES.ADD_PROGRAM}>
              Создать программу
            </Link>
          </div>
        </header>

        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Поиск программы"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <span className={styles.counter}>{filteredPrograms.length} программ</span>
        </div>

        <ProgramsGrid
          actionLabel="Открыть конструктор"
          className={styles.grid}
          onAction={() => navigate(ROUTES.ADD_PROGRAM)}
          programs={filteredPrograms}
        />
      </div>
    </section>
  )
}
