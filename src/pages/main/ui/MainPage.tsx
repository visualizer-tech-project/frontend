import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Graph from '@/features/graph/components/Graph'
import { useDrag } from '@/features/graph/hooks/useDrag'
import { ROUTES } from '@/shared/config'
import mainPhoto from '@/shared/assets/img/68fd5e5b666afed540a35d0629d1ac20.jpg'
import option from '@/shared/assets/img/Vector.svg'
import './MainPage.css'

export const MainPage = () => {
  const navigate = useNavigate()
  const {
    ref: asideRef,
    position: asidePosition,
    isDragging: isDraggingAside,
    isHidden: isAsideHidden,
    hiddenSide,
    hiddenCenterY,
    restoreAtPosition,
    handlePointerDown: handleAsidePointerDown,
    handlePointerMove: handleAsidePointerMove,
    handlePointerUp: finishAsideDrag,
    handlePointerCancel: finishAsideDragCancel,
  } = useDrag()

  const [arrowY, setArrowY] = useState<number>(window.innerHeight / 2)

  useEffect(() => {
    if (isAsideHidden) {
      setArrowY(hiddenCenterY)
    }
  }, [hiddenCenterY, isAsideHidden])

  const handleArrowClick = () => {
    let targetX = 0
    const asideWidth = 370

    if (hiddenSide === 'right') {
      targetX = window.innerWidth - asideWidth - 220
    }

    const asideHeightHalf = 260
    restoreAtPosition(targetX, arrowY - asideHeightHalf)
  }

  return (
    <div className='main-page'>
      <nav className='main-nav'>
        <img src={mainPhoto} alt='' />
        <div className='main-nav_right'>
          <button className='programs' type='button'>
            Программы
          </button>
          <button className='create-program' type='button'>
            + Создать программу
          </button>
        </div>
        <div className='main-nav_left'>
          <button className='notions' type='button'>
            Уведомления
          </button>
          <button className='my-programs' type='button'>
            Мои программы
          </button>
          <button className='profile' type='button' onClick={() => navigate(ROUTES.PROFILE)}>
            Профиль
          </button>
        </div>
      </nav>

      <section className='main-body'>
        <h1 className='title'>Название</h1>
        <Graph />
        <aside
          ref={asideRef}
          className={`aside ${isDraggingAside ? 'dragging' : ''} ${isAsideHidden ? 'hidden' : ''}`}
          onPointerDown={handleAsidePointerDown}
          onPointerMove={handleAsidePointerMove}
          onPointerUp={finishAsideDrag}
          onPointerCancel={finishAsideDragCancel}
          style={{ transform: `translate(${asidePosition.x}px, ${asidePosition.y}px)` }}
        >
          <div className='aside-top'>
            <input type='search' placeholder='Поиск курса' className='aside-search' id='aside-search' name='q' />
            <button type='button'>
              <img src={option} alt='' />
            </button>
          </div>
          <div className='aside-program'>
            <div className='aside-program-text'>
              <span className='program-title'>Инфа о курсе</span>
              <span className='program-subtitle'>Описание курсааааааааа ввввввввввв</span>
            </div>
            <button className='aside-program-button' type='button'>
              Перейти
            </button>
          </div>
        </aside>

        {isAsideHidden && (
          <div
            className={`return-arrow ${hiddenSide === 'left' ? 'left-arrow' : 'right-arrow'}`}
            onClick={handleArrowClick}
            style={{
              position: 'fixed',
              top: arrowY,
              left: hiddenSide === 'left' ? '20px' : 'auto',
              right: hiddenSide === 'right' ? '20px' : 'auto',
              transform: 'translateY(-50%)',
              zIndex: 9999,
              background: '#333',
              color: 'white',
              border: 'none',
              width: '38px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {hiddenSide === 'left' ? '←' : '→'}
          </div>
        )}
      </section>
    </div>
  )
}
