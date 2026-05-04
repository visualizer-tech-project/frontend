interface ButtonsBlockProps {
  onStudentClick?: () => void
  onTeacherClick?: () => void
}

const ButtonsBlock = ({ onStudentClick, onTeacherClick }: ButtonsBlockProps) => (
  <div className="modal-group">
    <span className="subtitle">Выбери роль</span>
    <div className="buttons">
      <button className="Modal-button" onClick={onStudentClick} type="button">
        Студент
      </button>
      <button className="Modal-button" onClick={onTeacherClick} type="button">
        Преподаватель
      </button>
    </div>
  </div>
)

export default ButtonsBlock
