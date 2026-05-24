import { courseTypeLabels } from '@/entities/course'
import { CourseEditButton, CourseEditForm } from '@/features/course-edit'
import { CourseProgressSelect } from '@/features/course-progress-select'
import { Button } from '@/shared/ui/Button'
import { DeleteOutlined } from '@ant-design/icons'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import clsx from 'clsx'
import { useState, type MouseEvent } from 'react'
import type { CourseFlowNodeData } from '../lib/createCourseNode'
import styles from './CourseFlowNode.module.css'

export const CourseFlowNode = ({ data }: NodeProps<Node<CourseFlowNodeData>>) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const {
    course,
    onCourseRemove,
    onCourseUpdate,
    onProgressChange,
    canEditFlow,
    canEditCourse,
    userId,
    progress,
  } = data

  const handleEditCourse = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsEdit((prev) => !prev)
  }

  return (
    <div
      className={clsx(
        styles.node,
        progress?.status === 'completed' && styles.completed,
        progress?.status === 'in_progress' && styles.inProgress,
      )}
    >
      <Handle
        className={clsx(
          styles.handle,
          progress?.status === 'completed' && styles.handleCompleted,
          progress?.status === 'in_progress' && styles.handleInProgress,
        )}
        position={Position.Left}
        type="target"
        isConnectable={canEditFlow}
        style={{ visibility: canEditFlow ? 'visible' : 'hidden' }}
      />
      <Handle
        className={clsx(
          styles.handle,
          progress?.status === 'completed' && styles.handleCompleted,
          progress?.status === 'in_progress' && styles.handleInProgress,
        )}
        position={Position.Right}
        type="source"
        isConnectable={canEditFlow}
        style={{ visibility: canEditFlow ? 'visible' : 'hidden' }}
      />

      <div className={styles.actions}>
        {canEditCourse && (
          <CourseEditButton
            onClick={handleEditCourse}
            className={clsx(styles.circleButton, styles.editButton)}
            isIcon
          />
        )}

        {canEditFlow && (
          <Button
            className={clsx(styles.removeButton, styles.circleButton, 'nodrag')}
            color="default"
            aria-label="Удалить курс"
            htmlType="button"
            icon={<DeleteOutlined />}
            variant="solid"
            onClick={() => onCourseRemove(course.id)}
          />
        )}
      </div>

      <div className={styles.header}>
        <span>Курс</span>
        <strong
          className={clsx(
            progress?.status === 'completed' && styles.completedLabel,
            progress?.status === 'in_progress' && styles.inProgressLabel,
          )}
        >
          {courseTypeLabels[course.type]}
        </strong>
      </div>

      <div className={styles.content}>
        <div className={styles.body}>
          {!isEdit ? (
            <>
              <h3>{course.title}</h3>
              {course.description ? <p>{course.description}</p> : <p>Описание не заполнено</p>}
            </>
          ) : (
            <CourseEditForm
              course={course}
              onCourseUpdate={onCourseUpdate}
              onClose={() => setIsEdit(false)}
            />
          )}
        </div>

        {canEditCourse && !isEdit && (
          <div className={styles.bottom}>
            <p className={styles.text}>
              Вы можете изменить этот курс, используя <strong>кнопку справа сверху</strong>
            </p>
            <p className={styles.text}>Это отразится на всех существующих программах</p>
          </div>
        )}

        {userId && (
          <div className={styles.statusWrapper}>
            <p className={styles.text}>
              <strong>Вы можете управлять статусом</strong>
            </p>
            <CourseProgressSelect
              userId={userId}
              courseId={course.id}
              progress={progress}
              onSelectChange={onProgressChange}
              className={clsx(styles.selectInput, 'nodrag')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
