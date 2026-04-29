import { useEffect, useState } from 'react'
import './TypewriterText.css'

interface TypewriterTextProps {
  fullText: string
  typingSpeed?: number
  onComplete?: () => void
}

const TypewriterText = ({ fullText, typingSpeed = 80, onComplete }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    const intervalId = window.setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1))
        index += 1
      } else {
        window.clearInterval(intervalId)

        if (onComplete) {
          window.setTimeout(() => {
            onComplete()
          }, 5)
        }
      }
    }, typingSpeed)

    return () => window.clearInterval(intervalId)
  }, [fullText, onComplete, typingSpeed])

  return <div className='typewriter-text'>{displayedText}</div>
}

export default TypewriterText
