import { useEffect, useState } from 'react'
import './ResponsiveNotice.css'

const STORAGE_KEY = 'responsive-notice-hidden'

export default function ResponsiveNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY)

    if (!hidden) {
      setVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="responsive-notice">
      <div className="responsive-notice__content">
        <span>Мобильная версия сайта сейчас в разработке.</span>

        <button onClick={handleClose}>✕</button>
      </div>
    </div>
  )
}
