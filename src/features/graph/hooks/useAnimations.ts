import gsap from 'gsap'
import { type MutableRefObject, type RefObject, useCallback } from 'react'

type TransitionState = 'idle' | 'opening' | 'open' | 'closing'

export const useAnimations = (
  containerRef: RefObject<HTMLDivElement | null>,
  backgroundRef: RefObject<HTMLDivElement | null>,
  buttonsRef: RefObject<HTMLDivElement | null>,
  textRef: RefObject<HTMLDivElement | null>,
  blackCircleRef: RefObject<HTMLDivElement | null>,
  blackCircleFillRef: RefObject<HTMLDivElement | null>,
  studentContentRef: RefObject<HTMLDivElement | null>,
  transitionStateRef: MutableRefObject<TransitionState>,
  setShowBackground: (value: boolean) => void,
  setShowButtons: (value: boolean) => void,
  setSelectedRole: (role: 'student' | 'teacher' | null) => void,
) => {
  const animateTextRise = useCallback(() => {
    if (!containerRef.current) {
      return
    }

    const timeline = gsap.timeline()

    timeline
      .to(containerRef.current, {
        y: 20,
        duration: 0.1,
        ease: 'elastic.out(0.1, 0.2)',
        onComplete: () => {
          gsap.delayedCall(0.005, () => setShowBackground(true))
        },
      })
      .to(containerRef.current, {
        y: -250,
        duration: 0.5,
        ease: 'power3.out',
        filter: 'blur(2px)',
      })
      .to(
        containerRef.current,
        {
          filter: 'none',
          duration: 0.3,
        },
        '-=0.3',
      )
      .to(containerRef.current, {
        y: -250,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
  }, [containerRef, setShowBackground])

  const animateBackground = useCallback(() => {
    if (!backgroundRef.current) {
      return
    }

    const timeline = gsap.timeline()

    timeline.to(backgroundRef.current, {
      paddingBottom: 650,
      duration: 0.8,
      ease: 'elastic.out(0.1, 0.1)',
    })

    timeline.call(() => setShowButtons(true), [], '-=0.5')
  }, [backgroundRef, setShowButtons])

  const animateButtons = useCallback(() => {
    if (!buttonsRef.current) {
      return
    }

    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, scale: 0.5, pointerEvents: 'none', userSelect: 'none' },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(0.5, 0.5)',
        onComplete: () => {
          if (buttonsRef.current) {
            buttonsRef.current.style.pointerEvents = 'auto'
            buttonsRef.current.style.userSelect = 'auto'
          }
        },
      },
    )
  }, [buttonsRef])

  const collapseBackground = useCallback(
    (role: 'student' | 'teacher') => {
      if (
        !backgroundRef.current ||
        !buttonsRef.current ||
        !textRef.current ||
        !blackCircleRef.current ||
        !blackCircleFillRef.current ||
        !studentContentRef.current ||
        transitionStateRef.current !== 'idle'
      ) {
        return
      }

      transitionStateRef.current = 'opening'

      gsap.killTweensOf([
        backgroundRef.current,
        buttonsRef.current,
        textRef.current,
        blackCircleRef.current,
        blackCircleFillRef.current,
        studentContentRef.current,
      ])

      buttonsRef.current.style.pointerEvents = 'none'
      buttonsRef.current.style.userSelect = 'none'
      textRef.current.style.pointerEvents = 'none'
      textRef.current.style.userSelect = 'none'

      gsap.set(studentContentRef.current, {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
      })
      gsap.set(blackCircleRef.current, { clipPath: 'circle(0% at 50% 30%)' })
      gsap.set(blackCircleFillRef.current, {
        scale: 1,
        transformOrigin: 'center center',
      })

      const timeline = gsap.timeline({
        onComplete: () => {
          if (transitionStateRef.current === 'opening') {
            transitionStateRef.current = 'open'
          }
        },
      })

      timeline
        .to(
          buttonsRef.current,
          {
            opacity: 0,
            scale: 0,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          0,
        )
        .to(
          textRef.current,
          {
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0,
        )
        .to(
          backgroundRef.current,
          {
            backgroundColor: 'rgb(27, 27, 27)',
            boxShadow: '0px 0px 20px 8px #181e23ff',
            duration: 1.5,
            ease: 'power2.inOut',
          },
          0.15,
        )
        .to(
          blackCircleRef.current,
          {
            clipPath: 'circle(170% at 50% 30%)',
            duration: 1.5,
            ease: 'power2.inOut',
          },
          0.15,
        )
        .to(
          blackCircleFillRef.current,
          {
            scale: 1.04,
            duration: 5,
            ease: 'elastic.out(0.5, 0.3)',
          },
          0,
        )
        .call(
          () => {
            window.localStorage.setItem('selectedRole', role)
            setSelectedRole(role)
            transitionStateRef.current = 'open'
          },
          [],
          1.18,
        )
        .set(studentContentRef.current, { visibility: 'visible' }, 1.18)
        .to(
          studentContentRef.current,
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power1.out',
            onStart: () => {
              if (studentContentRef.current) {
                studentContentRef.current.style.pointerEvents = 'auto'
              }
            },
          },
          1.18,
        )
    },
    [
      backgroundRef,
      buttonsRef,
      textRef,
      blackCircleRef,
      blackCircleFillRef,
      studentContentRef,
      transitionStateRef,
      setSelectedRole,
    ],
  )

  return { animateTextRise, animateBackground, animateButtons, collapseBackground }
}
