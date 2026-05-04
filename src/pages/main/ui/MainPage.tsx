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
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useDrag()

  return (
    <div className="main-page">
      <nav className="main-nav">
        <img src={mainPhoto} alt="" />

        <div className="main-nav_right">
          <button className="programs">Программы</button>
          <button className="create-program">+ Создать программу</button>
        </div>

        <div className="main-nav_left">
          <button className="notions">Уведомления</button>
          <button className="my-programs">Мои программы</button>
          <button onClick={() => navigate(ROUTES.PROFILE)}>Профиль</button>
        </div>
      </nav>

      <section className="main-body">
        <h1 className="title">Название</h1>

        <Graph />

        <aside
          ref={asideRef}
          className={`aside ${isDragging ? 'dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{ transform: `translate(${asidePosition.x}px, ${asidePosition.y}px)` }}
        >
          <button className="aside-close">X</button>

          <div className="aside-top">
            <input type="search" placeholder="Поиск курса" className="aside-search" />
            <button>
              <img src={option} alt="" />
            </button>
          </div>

          <div className="aside-program">
            <div className="aside-program-text">
              <span className="program-title">Инфа о курсе</span>
              <span className="program-subtitle">Описание курсааааааааа ввввввввввв</span>
            </div>
            <button className="aside-program-button">Перейти</button>
          </div>
        </aside>
      </section>
    </div>
  )
}
