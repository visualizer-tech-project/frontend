import { useEffect, useRef, useState } from 'react'
import './HomePage.css'
import { MainContent } from './MainContent'

export const HomePage = () => {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) {
      return
    }

    hasRun.current = true
    const hasVisited = window.localStorage.getItem('hasVisited')

    if (!hasVisited) {
      setShowWelcome(true)
      window.localStorage.setItem('hasVisited', 'true')
    } else {
      setShowWelcome(false)
    }
  }, [])

  if (showWelcome === null) {
    return null
  }

  return (
    <div className='HomePage'>
      <div className='background-lines'>
        <svg className='svg-lines' width='100%' height='100%' preserveAspectRatio='none' viewBox='0 0 1000 600'>
          <path
            className='wave wave1'
            d='M0,250 C100,180 200,120 300,120 C400,120 500,280 600,280 C700,280 800,340 900,340 C950,340 1000,350 1000,350'
          />
          <path
            className='wave wave2'
            d='M0,350 C100,280 200,220 300,220 C400,220 500,380 600,380 C700,380 800,200 900,200 C950,200 1000,250 1000,250'
          />
          <path
            className='wave wave3'
            d='M0,150 C100,200 200,250 300,250 C400,250 500,300 600,300 C700,300 800,400 900,400 C950,400 1000,450 1000,450'
          />
          <path
            className='wave wave4'
            d='M0,450 C100,400 200,350 300,350 C400,350 500,300 600,300 C700,300 800,200 900,200 C950,200 1000,150 1000,150'
          />
        </svg>
      </div>

      <MainContent showWelcome={showWelcome} />
    </div>
  )
}
