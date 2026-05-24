import { courseTypeLabels, type Course } from '@/entities/course'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { useFloatingPanelDrag } from '@/shared/lib/useFloatingPanelDrag'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CoursePicker.module.css'
import { CreateCourseForm } from './CreateCourseForm'

const EDGE_PADDING = 16

interface CoursePickerFormValues {
  courseId: number | null
}

interface CoursePickerProps {
  courses: Course[]
  onExistingCourseAdd: (course: Course) => void
  onNewCourseAdd: (course: Course) => void
  programCourses: Course[]
  isLoading?: boolean
}

type CoursePickerPendingAction = 'adding-existing' | 'creating-new'

export const CoursePicker = ({
  courses,
  onExistingCourseAdd,
  onNewCourseAdd,
  programCourses,
  isLoading = false,
}: CoursePickerProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pendingAction, setPendingAction] = useState<CoursePickerPendingAction | null>(null)
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
  } = useFloatingPanelDrag({ x: 32, y: 32 }, EDGE_PADDING)

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

  const isAddingExisting = pendingAction === 'adding-existing'
  const isCreatingCourse = pendingAction === 'creating-new'
  const isPending = Boolean(pendingAction)
  const pendingMessage = isLoading
    ? 'Загружаем курсы...'
    : isAddingExisting
      ? 'Добавляем курс на холст...'
      : isCreatingCourse
        ? 'Создаем новый курс...'
        : null

  const handleAddExistingCourse = async () => {
    if (!selectedCourse || isPending || isLoading) {
      return
    }

    setPendingAction('adding-existing')

    try {
      await wait(350)
      onExistingCourseAdd(selectedCourse)
      reset()
      setSearchValue('')
      notifySuccess('Курс добавлен', 'Курс успешно добавлен на холст.')
    } catch {
      notifyError('Не удалось добавить курс', 'Попробуйте выбрать курс еще раз.')
    } finally {
      setPendingAction(null)
    }
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
            disabled={isPending}
            htmlType="button"
            variant="text"
            onClick={() => setIsCollapsed((value) => !value)}
          >
            {isCollapsed ? 'Раскрыть' : 'Скрыть'}
          </Button>
        </div>

        {pendingMessage ? (
          <div className={styles.pendingState} role="status" aria-live="polite">
            <span className={styles.pendingSpinner} />
            {pendingMessage}
          </div>
        ) : null}

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
                loading={isLoading}
                disabled={isLoading || isPending || !courses.length}
                onSearch={setSearchValue}
              />
            </div>

            <div className={styles.selectedList} aria-label="Выбранный курс">
              {isLoading ? (
                <p className={styles.empty}>Курсы загружаются...</p>
              ) : selectedCourse ? (
                <div className={styles.selectedCourse}>
                  <div>
                    <strong>{selectedCourse.title}</strong>
                    <span className={styles.empty}>
                      {selectedCourse.description || 'Описание не заполнено'}
                    </span>
                  </div>
                  <Button
                    className={styles.courseActionButton}
                    disabled={programCourseIds.has(selectedCourse.id) || isPending || isLoading}
                    loading={isAddingExisting}
                    onClick={handleAddExistingCourse}
                  >
                    {programCourseIds.has(selectedCourse.id) ? 'Уже добавлен' : 'Добавить'}
                  </Button>
                </div>
              ) : !courses.length ? (
                <p className={styles.empty}>Доступных курсов пока нет.</p>
              ) : (
                <p className={styles.empty}>Выбери курс из списка или добавь новый ниже.</p>
              )}
            </div>

            <CreateCourseForm
              disabled={isLoading || isAddingExisting}
              onCourseCreated={onNewCourseAdd}
              onPendingChange={(isSubmitting) =>
                setPendingAction(isSubmitting ? 'creating-new' : null)
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
