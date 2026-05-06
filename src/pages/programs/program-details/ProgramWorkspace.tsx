import { mockPrograms, type Program } from '@/entities/program'
import { ProgramGraph } from '@/features/program-graph'
import { useFloatingPanelDrag } from '@/features/program-sidebar/model/useFloatingPanelDrag'
import { ROUTES } from '@/shared/config'
import clsx from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProgramWorkspace.module.css'

interface ProgramWorkspaceProps {
  heading: string
  program?: Program
  subtitle: string
}

export const ProgramWorkspace = ({ heading, program, subtitle }: ProgramWorkspaceProps) => {
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
    ) ??
    program ??
    mockPrograms[0]

  const handleRestorePanel = () => {
    const panelHeight = ref.current?.getBoundingClientRect().height ?? 230
    const panelWidth = ref.current?.getBoundingClientRect().width ?? 370
    const appHeader = document.querySelector('[data-app-header="true"]')
    const appHeaderHeight =
      appHeader instanceof HTMLElement ? appHeader.getBoundingClientRect().height : 0
    const minY = appHeaderHeight + 16
    const maxY = Math.max(minY, window.innerHeight - panelHeight - 16)
    const nextY = Math.min(maxY, Math.max(minY, hiddenCenterY - panelHeight / 2))
    const nextX = hiddenSide === 'left' ? 24 : Math.max(24, window.innerWidth - panelWidth - 24)

    restoreAtPosition(nextX, nextY)
  }

  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Рабочая область</p>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.graphArea}>
          <ProgramGraph />
        </div>

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
              onClick={() => navigate(`${ROUTES.PROGRAMS}/${activeProgram.id}`)}
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
