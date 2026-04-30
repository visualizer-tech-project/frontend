import TypewriterText from '../TypewriterText/TypewriterText'
import './AnimatedText.css'

interface AnimatedTextProps {
  showWelcome: boolean
  isRaised: boolean
  onTypingComplete: () => void
}

const AnimatedText = ({ showWelcome, isRaised, onTypingComplete }: AnimatedTextProps) => {
  return (
    <div className='animated-text'>
      {showWelcome && !isRaised ? (
        <TypewriterText fullText='Здравствуй, Пользователь' onComplete={onTypingComplete} />
      ) : (
        <div className='static-text'>Здравствуй, Пользователь</div>
      )}
    </div>
  )
}

export default AnimatedText
