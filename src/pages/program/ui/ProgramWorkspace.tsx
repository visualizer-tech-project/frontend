import clsx from 'clsx'
import { mockPrograms } from '@/entities/program'
import { ProgramGraph } from '@/features/program-graph'
import { useFloatingPanelDrag } from '@/features/program-sidebar/model/useFloatingPanelDrag'
import { ROUTES } from '@/shared/config'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './ProgramWorkspace.module.css'

interface ProgramWorkspaceProps {
  heading: string
  subtitle: string
}

export const ProgramWorkspace = ({ heading, subtitle }: ProgramWorkspaceProps) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const {
    ref,
    position,
    isDragging,
    isHidden,
    hiddenSide,
    hiddenCenterY,
    restoreAtPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useFloatingPanelDrag()

  const normalizedSearch = searchValue.trim().toLowerCase()
  const activeProgram =
    mockPrograms.find((program) =>
      `${program.title} ${program.description}`.toLowerCase().includes(normalizedSearch),
    ) ?? mockPrograms[0]

  const handleRestorePanel = () => {
    const panelHeight = ref.current?.getBoundingClientRect().height ?? 230
    const panelWidth = ref.current?.getBoundingClientRect().width ?? 370
    const navigationHeight =
      document.querySelector('[data-program-nav="true"]') instanceof HTMLElement
        ? (
            document.querySelector('[data-program-nav="true"]') as HTMLElement
          ).getBoundingClientRect().height
        : 0
    const minY = navigationHeight + 16
    const maxY = Math.max(minY, window.innerHeight - panelHeight - 16)
    const nextY = Math.min(maxY, Math.max(minY, hiddenCenterY - panelHeight / 2))
    const nextX = hiddenSide === 'left' ? 24 : Math.max(24, window.innerWidth - panelWidth - 24)

    restoreAtPosition(nextX, nextY)
  }

  return (
    <section className={styles.page}>
      <nav className={styles.nav} data-program-nav="true">
        <Link className={styles.brand} to={ROUTES.HOME}>
          <span className={styles.brandMark}>EM</span>
          <span className={styles.brandText}>Edu Map</span>
        </Link>

        <div className={styles.navGroup}>
          <Link className={styles.navLink} to={ROUTES.PROGRAMS}>
            Программы
          </Link>
          <Link className={clsx(styles.navLink, styles.navLinkAccent)} to={ROUTES.ADD_PROGRAM}>
            + Создать программу
          </Link>
        </div>

        <div className={styles.navGroup}>
          <Link className={styles.navLink} to={ROUTES.HOME}>
            На главную
          </Link>
          <Link className={styles.navLink} to={ROUTES.PROGRAMS}>
            Мои программы
          </Link>
          <Link className={styles.navLink} to={ROUTES.PROFILE}>
            Профиль
          </Link>
        </div>
      </nav>

      <div className={styles.body}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Рабочая область</p>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <ProgramGraph />

        <aside
          ref={ref}
          className={clsx(
            styles.aside,
            isDragging && styles.asideDragging,
            isHidden && styles.asideHidden,
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className={styles.asideTop}>
            <input
              className={styles.asideSearch}
              name="q"
              placeholder="Поиск курса"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />

            <button
              className={styles.asideIconButton}
              type="button"
              aria-label="Открыть каталог программ"
            >
              ≡
            </button>
          </div>

          <div className={styles.asideProgram}>
            <div className={styles.asideProgramText}>
              <span className={styles.programTitle}>{activeProgram.title}</span>
              <span className={styles.programSubtitle}>{activeProgram.description}</span>
            </div>

            <button
              className={styles.asideProgramButton}
              type="button"
              onClick={() => navigate(ROUTES.PROGRAMS)}
            >
              Перейти
            </button>
          </div>
        </aside>

        {isHidden && hiddenSide ? (
          <button
            className={clsx(
              styles.returnArrow,
              hiddenSide === 'left' ? styles.returnArrowLeft : styles.returnArrowRight,
            )}
            style={{ top: `${hiddenCenterY}px` }}
            type="button"
            onClick={handleRestorePanel}
          >
            {hiddenSide === 'left' ? '←' : '→'}
          </button>
        ) : null}
      </div>
    </section>
  )
}
