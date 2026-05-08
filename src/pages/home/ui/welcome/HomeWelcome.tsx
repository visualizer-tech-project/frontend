import { Button } from '@/shared/ui/Button/Button'
import TypewriterText from '@/shared/ui/TypewriterText/TypewriterText'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './HomeWelcome.module.css'

const ROLE_TRANSITION_DELAY_MS = 800
const WELCOME_TEXT = 'Здравствуйте, Пользователь'

interface HomeWelcomeProps {
  onStudentClick: () => boolean
  onStudentTransitionComplete: () => void
  onTeacherClick: () => boolean
  onTeacherTransitionComplete: () => void
}

export const HomeWelcome = ({
  onStudentClick,
  onStudentTransitionComplete,
  onTeacherClick,
  onTeacherTransitionComplete,
}: HomeWelcomeProps) => {
  const [isRaised, setIsRaised] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [isRoleTransitioning, setIsRoleTransitioning] = useState(false)
  const transitionTimeoutRef = useRef<number | null>(null)

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearTransitionTimeout, [clearTransitionTimeout])

  const handleTypingComplete = () => {
    setIsRaised(true)
    setShowButtons(true)
  }

  const startRoleTransition = useCallback(
    (selectRole: () => boolean, onTransitionComplete: () => void) => {
      if (isRoleTransitioning || !selectRole()) {
        return
      }

      clearTransitionTimeout()
      setIsRaised(true)
      setShowButtons(false)
      setIsRoleTransitioning(true)

      transitionTimeoutRef.current = window.setTimeout(() => {
        onTransitionComplete()
        transitionTimeoutRef.current = null
      }, ROLE_TRANSITION_DELAY_MS)
    },
    [clearTransitionTimeout, isRoleTransitioning],
  )

  return (
    <div className={`${styles.root} ${isRoleTransitioning ? styles.rootLeaving : ''}`}>
      <div className={styles.background} />
      <div className={styles.blackLayer} />

      <div className={styles.content}>
        <div className={styles.animatedText} aria-live={!isRaised ? 'polite' : undefined}>
          <h1 className={styles.title}>
            {!isRaised ? (
              <TypewriterText fullText={WELCOME_TEXT} onComplete={handleTypingComplete} />
            ) : (
              WELCOME_TEXT
            )}
          </h1>
        </div>

        <div className={`${styles.buttonsBlock} ${!showButtons ? styles.buttonsBlockHidden : ''}`}>
          <div className={styles.modalGroup}>
            <span className={styles.roleTitle}>Выберите роль</span>
            <div className={styles.roleActions}>
              <Button
                className={styles.roleButton}
                color="default"
                htmlType="button"
                variant="solid"
                disabled={isRoleTransitioning}
                onClick={() => startRoleTransition(onStudentClick, onStudentTransitionComplete)}
              >
                Студент
              </Button>
              <Button
                className={styles.roleButton}
                color="default"
                htmlType="button"
                variant="solid"
                disabled={isRoleTransitioning}
                onClick={() => startRoleTransition(onTeacherClick, onTeacherTransitionComplete)}
              >
                Преподаватель
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
