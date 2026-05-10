import { courseTypeLabels, type Course } from '@/entities/course'
import { useFloatingPanelDrag } from '@/shared/lib/useFloatingPanelDrag'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CoursePicker.module.css'
import { CreateCourseForm } from './CreateCourseForm'

const EDGE_PADDING = 16
const HIDE_OFFSET = 24

interface CoursePickerFormValues {
  courseId: number | null
}

interface CoursePickerProps {
  courses: Course[]
  onExistingCourseAdd: (course: Course) => void
  onNewCourseAdd: (course: Course) => void
  programCourses: Course[]
}

export const CoursePicker = ({
  courses,
  onExistingCourseAdd,
  onNewCourseAdd,
  programCourses,
}: CoursePickerProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { control, reset, watch } = useForm<CoursePickerFormValues>({
    defaultValues: {
      courseId: null,
    },
  })
  const selectedCourseId = watch('courseId')
  const {
    ref,
    position,
    isDragging,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useFloatingPanelDrag({ x: 32, y: 32 }, EDGE_PADDING, HIDE_OFFSET)

  const programCourseIds = useMemo(
    () => new Set(programCourses.map((course) => course.id)),
    [programCourses],
  )

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  )

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        label: `${course.title} · ${courseTypeLabels[course.type]}`,
        value: course.id,
        searchLabel: [course.title, course.description, courseTypeLabels[course.type], course.id]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      })),
    [courses],
  )

  const filteredCourseOptions = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return courseOptions
    }

    return courseOptions.filter((option) => option.searchLabel.includes(normalizedSearch))
  }, [courseOptions, searchValue])

  const handleAddExistingCourse = () => {
    if (!selectedCourse) {
      return
    }

    onExistingCourseAdd(selectedCourse)
    reset()
    setSearchValue('')
  }

  return (
    <div
      ref={(element) => {
        ref.current = element
      }}
      className={styles.floatingPanel}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onPointerCancel={handlePointerCancel}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={styles.dragHandle}
        data-dragging={isDragging || undefined}
        onPointerDown={handlePointerDown}
      >
        <span />
      </div>

      <div className={styles.root}>
        <div className={styles.panelHeader}>
          <div className={styles.info}>
            <span className={styles.eyebrow}>Курсы</span>
            <strong>{programCourses.length} на холсте</strong>
          </div>

          <Button
            className={styles.collapseButton}
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => setIsCollapsed((value) => !value)}
          >
            {isCollapsed ? 'Раскрыть' : 'Скрыть'}
          </Button>
        </div>

        {!isCollapsed && (
          <div className={styles.content}>
            <div className={styles.searchRow}>
              <SelectField<CoursePickerFormValues, number>
                control={control}
                name="courseId"
                showSearch
                className={styles.courseSelect}
                optionFilterProp="label"
                options={filteredCourseOptions}
                placeholder="Поиск курса"
                searchValue={searchValue}
                onSearch={setSearchValue}
              />
            </div>

            <div className={styles.selectedList} aria-label="Выбранный курс">
              {selectedCourse ? (
                <div className={styles.selectedCourse}>
                  <div>
                    <strong>{selectedCourse.title}</strong>
                    <span className={styles.empty}>
                      {selectedCourse.description || 'Описание не заполнено'}
                    </span>
                  </div>
                  <Button
                    className={styles.courseActionButton}
                    disabled={programCourseIds.has(selectedCourse.id)}
                    onClick={handleAddExistingCourse}
                  >
                    {programCourseIds.has(selectedCourse.id) ? 'Уже добавлен' : 'Добавить'}
                  </Button>
                </div>
              ) : (
                <p className={styles.empty}>Выбери курс из списка или добавь новый ниже.</p>
              )}
            </div>

            <CreateCourseForm onCourseCreated={onNewCourseAdd} />
          </div>
        )}
      </div>
    </div>
  )
}
