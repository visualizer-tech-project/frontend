import type { Course } from '@/entities/course'
import type { Prerequisite, PrerequisiteCreate } from '@/entities/prerequisite'
import type { ProgressSelectChangePayload, UserProgress } from '@/entities/progress'
import { useUserState, useUserStore } from '@/entities/user'
import {
  COURSE_TYPE_FILTER_ALL,
  CourseTypeFilter,
  shouldDimCourseByTypeFilter,
  type CourseTypeFilterValue,
} from '@/features/course-type-filter'
import { getDagreLayoutedNodes } from '@/shared/lib/getDagreLayoutedNodes'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { canEditCourse } from '../lib/canEditCourse'
import { createCourseNode, type CourseFlowNodeData } from '../lib/createCourseNode'
import { mapConnectionToPrerequisiteCreate } from '../lib/mapConnectionToPrerequisiteCreate'
import { mapDeletedEdgesToPrerequisites } from '../lib/mapDeletedEdgesToPrerequisites'
import { mapPrerequisitesToCourseTypeFilteredEdges } from '../lib/mapPrerequisitesToCourseTypeFilteredEdges'
import { CourseFlowNode } from './CourseFlowNode'
import styles from './ProgramFlowCanvas.module.css'

interface ProgramFlowCanvasProps {
  courses: Course[]
  prerequisites: Prerequisite[]
  progress: UserProgress[]
  canEditFlow: boolean
  onCourseRemove: (courseId: number) => void | Promise<void>
  onCourseUpdate: (course: Course) => void
  onEdgeConnect: (courseId: number, prerequisiteCreate: PrerequisiteCreate) => void
  onProgressChange: (payload: ProgressSelectChangePayload) => void
  onEdgeDelete: (prerequisite: Prerequisite) => void | Promise<void>
  isLoading?: boolean
  isEdgeDeleting?: boolean
  removingCourseIds?: Course['id'][]
}

const nodeTypes: NodeTypes = {
  course: CourseFlowNode,
}

const flowProOptions = { hideAttribution: true }
const fitViewOptions = {
  minZoom: 0.8,
  maxZoom: 0.8,
}

export const ProgramFlowCanvas = ({
  courses,
  prerequisites,
  progress,
  canEditFlow,
  onCourseRemove,
  onCourseUpdate,
  onProgressChange,
  onEdgeConnect,
  onEdgeDelete,
  isLoading = false,
  isEdgeDeleting = false,
  removingCourseIds = [],
}: ProgramFlowCanvasProps) => {
  const { user } = useUserStore(useShallow(useUserState))
  const activeUserId = user?.id ?? null

  const [courseTypeFilter, setCourseTypeFilter] =
    useState<CourseTypeFilterValue>(COURSE_TYPE_FILTER_ALL)
  const isLayoutAppliedRef = useRef(false)
  const removingCourseIdSet = useMemo(() => new Set(removingCourseIds), [removingCourseIds])
  const isInteractionLocked = isLoading || isEdgeDeleting
  const canEditEdges = canEditFlow && !isInteractionLocked

  const dimmedCourseIdSet = useMemo(
    () =>
      new Set(
        courses
          .filter((course) => shouldDimCourseByTypeFilter(course.type, courseTypeFilter))
          .map((course) => course.id),
      ),
    [courses, courseTypeFilter],
  )

  const progressByCourseId = useMemo(() => {
    const map = new Map<Course['id'], UserProgress>()

    if (!activeUserId) {
      return map
    }

    progress.forEach((item) => {
      if (item.user_id === activeUserId) {
        map.set(item.course_id, item)
      }
    })

    return map
  }, [activeUserId, progress])

  const initialNodes = useMemo(
    () =>
      courses.map((course, index) =>
        createCourseNode({
          course,
          userId: activeUserId,
          progress: progressByCourseId.get(course.id) ?? null,
          index,
          onCourseRemove,
          onCourseUpdate,
          onProgressChange,
          canEditFlow: canEditFlow,
          canEditCourse: canEditCourse(user, course),
          isCourseRemoving: removingCourseIdSet.has(course.id),
          isDimmed: dimmedCourseIdSet.has(course.id),
        }),
      ),
    [
      courses,
      activeUserId,
      progressByCourseId,
      onCourseRemove,
      onCourseUpdate,
      onProgressChange,
      canEditFlow,
      user,
      removingCourseIdSet,
      dimmedCourseIdSet,
    ],
  )

  const initialEdges = useMemo(
    () => mapPrerequisitesToCourseTypeFilteredEdges(prerequisites, dimmedCourseIdSet),
    [dimmedCourseIdSet, prerequisites],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CourseFlowNodeData>>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges)

  useEffect(() => {
    if (isLayoutAppliedRef.current) return
    if (!initialNodes.length) return

    const layoutedNodes = getDagreLayoutedNodes(initialNodes, initialEdges, 'LR')

    setNodes(layoutedNodes)
    setEdges(initialEdges)

    isLayoutAppliedRef.current = true
  }, [initialNodes, initialEdges, setNodes, setEdges])

  useEffect(() => {
    setNodes((currentNodes) => {
      const currentNodeById = new Map(currentNodes.map((node) => [node.id, node]))

      return courses.map((course, index) => {
        const nextNode = createCourseNode({
          course,
          userId: activeUserId,
          progress: progressByCourseId.get(course.id) ?? null,
          index,
          onCourseRemove,
          onCourseUpdate,
          onProgressChange,
          canEditFlow: canEditFlow,
          canEditCourse: canEditCourse(user, course),
          isCourseRemoving: removingCourseIdSet.has(course.id),
          isDimmed: dimmedCourseIdSet.has(course.id),
        })

        const currentNode = currentNodeById.get(nextNode.id)

        if (!currentNode) {
          return nextNode
        }

        return {
          ...currentNode,
          data: nextNode.data,
        }
      })
    })
  }, [
    courses,
    activeUserId,
    progressByCourseId,
    onCourseRemove,
    setNodes,
    canEditFlow,
    onCourseUpdate,
    onProgressChange,
    user,
    removingCourseIdSet,
    dimmedCourseIdSet,
  ])

  useEffect(() => {
    setEdges(mapPrerequisitesToCourseTypeFilteredEdges(prerequisites, dimmedCourseIdSet))
  }, [dimmedCourseIdSet, prerequisites, setEdges])

  const handleEdgesDelete = (deletedEdges: Edge[]) => {
    const deletedPrerequisites = mapDeletedEdgesToPrerequisites(deletedEdges, prerequisites)

    deletedPrerequisites.forEach((el) => onEdgeDelete(el))
  }

  const handleEdgeConnect = (connection: Connection) => {
    const prerequisiteCreateResult = mapConnectionToPrerequisiteCreate(connection)

    if (!prerequisiteCreateResult) {
      return
    }

    onEdgeConnect(prerequisiteCreateResult.courseId, prerequisiteCreateResult.payload)
  }

  return (
    <section className={styles.root} aria-label="Холст программы">
      <ReactFlowProvider>
        <ReactFlow
          fitView
          zoomOnScroll={false}
          panOnScroll
          zoomOnPinch
          className={styles.flow}
          edges={edges}
          nodes={nodes}
          nodeTypes={nodeTypes}
          edgesFocusable={!isInteractionLocked}
          elementsSelectable={!isInteractionLocked}
          nodesConnectable={canEditEdges}
          nodesDraggable={!isInteractionLocked}
          nodesFocusable={!isInteractionLocked}
          onConnect={canEditEdges ? handleEdgeConnect : undefined}
          onEdgesDelete={canEditEdges ? handleEdgesDelete : undefined}
          onEdgesChange={canEditEdges ? onEdgesChange : undefined}
          onNodesChange={onNodesChange}
          proOptions={flowProOptions}
          fitViewOptions={fitViewOptions}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls className={styles.controls} />
          <MiniMap
            pannable
            zoomable
            className={styles.miniMap}
            position="bottom-right"
            bgColor="#11161c"
            maskColor="rgb(0 0 0 / 45%)"
            nodeColor="#8cc3ff"
          />
        </ReactFlow>
      </ReactFlowProvider>

      {!isLoading && courses.length ? (
        <CourseTypeFilter
          className={styles.typeFilter}
          disabled={isInteractionLocked}
          value={courseTypeFilter}
          onChange={setCourseTypeFilter}
        />
      ) : null}

      {isLoading ? (
        <div className={styles.loading} aria-live="polite">
          <span className={styles.loader} />
          <strong>Загружаем граф</strong>
          <span>Курсы и связи появятся через несколько секунд.</span>
        </div>
      ) : isEdgeDeleting ? (
        <div className={styles.actionLoading} aria-live="polite">
          <span className={styles.smallLoader} />
          <strong>Удаляем связь</strong>
        </div>
      ) : !courses.length ? (
        <div className={styles.empty}>
          <strong>Холст пуст</strong>
          <span>Добавь курс, чтобы создать первый перетаскиваемый элемент.</span>
        </div>
      ) : null}
    </section>
  )
}
