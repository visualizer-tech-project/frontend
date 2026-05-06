import { useEffect, useRef, useState } from 'react'
import styles from './TypewriterText.module.css'

interface TypewriterTextProps {
  fullText: string
  typingSpeed?: number
  onComplete?: () => void
}

const TypewriterText = ({ fullText, typingSpeed = 80, onComplete }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const delay = Math.max(16, typingSpeed)
    let index = 0
    let completeTimeoutId: number | undefined

    setDisplayedText('')

    if (!fullText) {
      completeTimeoutId = window.setTimeout(() => {
        onCompleteRef.current?.()
      }, delay)

      return () => window.clearTimeout(completeTimeoutId)
    }

    const intervalId = window.setInterval(() => {
      index += 1
      setDisplayedText(fullText.slice(0, index))

      if (index >= fullText.length) {
        window.clearInterval(intervalId)
        completeTimeoutId = window.setTimeout(() => {
          onCompleteRef.current?.()
        }, 120)
      }
    }, delay)

    return () => {
      window.clearInterval(intervalId)

      if (completeTimeoutId) {
        window.clearTimeout(completeTimeoutId)
      }
    }
  }, [fullText, typingSpeed])

  return (
    <span className={styles.text}>
      <span>{displayedText}</span>
      <span className={styles.cursor} aria-hidden="true" />
    </span>
  )
}

export default TypewriterText
