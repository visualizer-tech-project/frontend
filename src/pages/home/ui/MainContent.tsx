import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnimations } from '@/features/graph/hooks/useAnimations'
import ProgramsGrid, { type Program } from '@/programs/components/ProgramsGrid'
import coursesData from '@/programs/data/courses-test.json'
import { ROUTES } from '@/shared/config'
import AnimatedText from '@/shared/ui/AnimatedText/AnimatedText'
import ButtonsBlock from '@/shared/ui/Button/ButtonsBlock'
import './MainContent.css'

interface MainContentProps {
  showWelcome: boolean
}

type TransitionState = 'idle' | 'opening' | 'open' | 'closing'

const programsData: Program[] = coursesData as Program[]

export const MainContent = ({ showWelcome }: MainContentProps) => {
  const navigate = useNavigate()
  const [isRaised, setIsRaised] = useState(!showWelcome)
  const [showButtons, setShowButtons] = useState(!showWelcome)
  const [showBackground, setShowBackground] = useState(!showWelcome)
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null)
  const [isReversing, setIsReversing] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const blackCircleRef = useRef<HTMLDivElement>(null)
  const blackCircleFillRef = useRef<HTMLDivElement>(null)
  const studentContentRef = useRef<HTMLDivElement>(null)
  const transitionStateRef = useRef<TransitionState>('idle')

  const { animateTextRise, animateBackground, animateButtons, collapseBackground } = useAnimations(
    containerRef,
    backgroundRef,
    buttonsRef,
    textRef,
    blackCircleRef,
    blackCircleFillRef,
    studentContentRef,
    transitionStateRef,
    setShowBackground,
    setShowButtons,
    setSelectedRole,
  )

  useEffect(() => {
    if (showWelcome && buttonsRef.current) {
      gsap.set(buttonsRef.current, { opacity: 0, pointerEvents: 'none', userSelect: 'none' })
    }
  }, [showWelcome])

  useEffect(() => {
    const savedRole = window.localStorage.getItem('selectedRole')

    if (savedRole === 'student' && !showWelcome) {
      setSelectedRole('student')

      requestAnimationFrame(() => {
        transitionStateRef.current = 'open'

        if (containerRef.current) {
          gsap.set(containerRef.current, { y: -250, filter: 'none' })
        }

        if (buttonsRef.current) {
          gsap.set(buttonsRef.current, { opacity: 0, scale: 0, pointerEvents: 'none', userSelect: 'none' })
        }

        if (textRef.current) {
          gsap.set(textRef.current, { opacity: 0, scale: 0, pointerEvents: 'none', userSelect: 'none' })
        }

        if (backgroundRef.current) {
          gsap.set(backgroundRef.current, {
            backgroundColor: 'rgb(27, 27, 27)',
            boxShadow: '0px 0px 20px 8px #181e23ff',
            paddingBottom: 650,
            transformOrigin: 'top',
          })
        }

        if (blackCircleRef.current) {
          gsap.set(blackCircleRef.current, { clipPath: 'circle(170% at 50% 30%)' })
        }

        if (blackCircleFillRef.current) {
          gsap.set(blackCircleFillRef.current, { scale: 1.04, transformOrigin: 'center center' })
        }

        if (studentContentRef.current) {
          gsap.set(studentContentRef.current, {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
          })
        }
      })
    }
  }, [showWelcome, animateTextRise])

  useEffect(() => {
    const savedRole = window.localStorage.getItem('selectedRole')

    if (!showWelcome && !selectedRole && !savedRole) {
      transitionStateRef.current = 'idle'

      if (containerRef.current) {
        gsap.set(containerRef.current, { y: -250 })
      }

      if (backgroundRef.current) {
        gsap.set(backgroundRef.current, {
          backgroundColor: 'rgb(236, 243, 245, 0.98)',
          boxShadow: '0px 0px 20px 8px #354e61',
          paddingBottom: 650,
          transformOrigin: 'top',
        })
      }

      if (blackCircleRef.current) {
        gsap.set(blackCircleRef.current, { clipPath: 'circle(0% at 50% 30%)' })
      }

      if (blackCircleFillRef.current) {
        gsap.set(blackCircleFillRef.current, { scale: 1, transformOrigin: 'center center' })
      }

      if (studentContentRef.current) {
        gsap.set(studentContentRef.current, {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        })
      }

      if (buttonsRef.current) {
        gsap.set(buttonsRef.current, { opacity: 1, scale: 1, y: 0 })
        buttonsRef.current.style.pointerEvents = ''
        buttonsRef.current.style.userSelect = ''
      }

      if (textRef.current) {
        textRef.current.style.pointerEvents = ''
        textRef.current.style.userSelect = ''
      }
    }
  }, [selectedRole, showWelcome])

  useEffect(() => {
    if (showBackground && showWelcome && !selectedRole && isReversing) {
      animateBackground()
    }
  }, [animateBackground, isReversing, selectedRole, showBackground, showWelcome])

  useEffect(() => {
    if (showButtons && showWelcome && !selectedRole && isReversing) {
      animateButtons()
    }
  }, [animateButtons, isReversing, selectedRole, showButtons, showWelcome])

  const reverseCollapse = useCallback(() => {
    if (
      !blackCircleRef.current ||
      !blackCircleFillRef.current ||
      !backgroundRef.current ||
      !studentContentRef.current ||
      !textRef.current ||
      !buttonsRef.current ||
      transitionStateRef.current !== 'open'
    ) {
      return false
    }

    transitionStateRef.current = 'closing'

    gsap.killTweensOf([
      blackCircleRef.current,
      blackCircleFillRef.current,
      backgroundRef.current,
      textRef.current,
      buttonsRef.current,
    ])
    textRef.current.style.pointerEvents = 'auto'
    textRef.current.style.userSelect = 'auto'
    buttonsRef.current.style.pointerEvents = 'auto'
    buttonsRef.current.style.userSelect = 'auto'

    const timeline = gsap.timeline({
      onComplete: () => {
        setSelectedRole(null)
        setShowButtons(true)
        setShowBackground(true)
        setIsRaised(true)

        if (backgroundRef.current) {
          gsap.set(backgroundRef.current, {
            backgroundColor: 'rgb(236, 243, 245, 0.98)',
            boxShadow: '0px 0px 20px 8px #354e61',
          })
        }

        if (blackCircleRef.current) {
          gsap.set(blackCircleRef.current, { clipPath: 'circle(0% at 50% 30%)' })
        }

        if (blackCircleFillRef.current) {
          gsap.set(blackCircleFillRef.current, { scale: 1, transformOrigin: 'center center' })
        }

        transitionStateRef.current = 'idle'
        setIsReversing(false)
      },
    })

    timeline
      .to(
        blackCircleFillRef.current,
        {
          scale: 1,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        backgroundRef.current,
        {
          backgroundColor: 'rgb(236, 243, 245, 0.98)',
          boxShadow: '0px 0px 20px 8px #354e61',
          duration: 1.5,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        blackCircleRef.current,
        {
          clipPath: 'circle(0% at 50% 30%)',
          duration: 1.7,
          ease: 'power2.inOut',
        },
        '-=2',
      )
      .fromTo(
        textRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(0.8)' },
        '-=0.5',
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(0.8)' },
        '-=0.8',
      )

    return true
  }, [])

  const handleTypingComplete = () => {
    setIsRaised(true)
    animateTextRise()
  }

  const handleStudentClick = () => {
    collapseBackground('student')
  }

  const handleTeacherClick = () => {
    window.localStorage.removeItem('selectedRole')
    navigate(ROUTES.MAIN)
  }

  const handleBackClick = () => {
    const hasStartedReverse = reverseCollapse()

    if (hasStartedReverse) {
      window.localStorage.removeItem('selectedRole')
    }
  }

  return (
    <div ref={containerRef} className='main-content'>
      <div ref={backgroundRef} className='main-content-background'>
        <div ref={blackCircleRef} className='black-circle'>
          <div ref={blackCircleFillRef} className='black-circle-fill' />
          <div
            ref={studentContentRef}
            className={`student-content ${selectedRole === 'student' ? 'active' : ''}`}
            aria-hidden={selectedRole !== 'student'}
          >
            <div className='student-choice'>
              <button onClick={handleBackClick} className='back-button' type='button'>
                Back
              </button>
              <input type='search' className='search' id='site-search' name='q' />
            </div>
            {programsData.length > 0 && <ProgramsGrid programs={programsData} />}
          </div>
        </div>
      </div>

      <div
        ref={textRef}
        className={`text-container ${selectedRole ? 'hidden' : ''}`}
        style={{ display: 'inline-block' }}
      >
        <AnimatedText showWelcome={showWelcome} isRaised={isRaised} onTypingComplete={handleTypingComplete} />
      </div>

      <div ref={buttonsRef} className='buttons-block'>
        <ButtonsBlock onStudentClick={handleStudentClick} onTeacherClick={handleTeacherClick} />
      </div>
    </div>
  )
}
