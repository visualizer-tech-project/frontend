import type { Course } from '@/entities/course'
import type { Prerequisite, PrerequisiteCreate } from '@/entities/prerequisite'
import type { UserProgress } from '@/entities/progress'
import type { ProgressSelectChangePayload } from '@/entities/progress/model/types'
import { useUserState, useUserStore } from '@/entities/user'
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
import { useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { canEditCourse } from '../lib/canEditCourse'
import { createCourseNode, type ICourseFlowNodeData } from '../lib/createCourseNode'
import { mapConnectionToPrerequisiteCreate } from '../lib/mapConnectionToPrerequisiteCreate'
import { mapDeletedEdgesToPrerequisites } from '../lib/mapDeletedEdgesToPrerequisites'
import { mapPrerequisitesToEdges } from '../lib/mapPrerequisitesToEdges'
import { defaultEdgeOptions } from '../model/customFlowStyles'
import { CourseFlowNode } from './CourseFlowNode'
import styles from './ProgramFlowCanvas.module.css'

interface ProgramFlowCanvasProps {
  courses: Course[]
  prerequisites: Prerequisite[]
  progress: UserProgress[]
  canEditFlow: boolean
  onCourseRemove: (courseId: number) => void
  onCourseUpdate: (course: Course) => void
  onEdgeConnect: (courseId: number, prerequisiteCreate: PrerequisiteCreate) => void
  onProgressChange: (payload: ProgressSelectChangePayload) => void
  onEdgeDelete: (prerequisite: Prerequisite) => void
}

const nodeTypes: NodeTypes = {
  course: CourseFlowNode,
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
}: ProgramFlowCanvasProps) => {
  const { user } = useUserStore(useShallow(useUserState))

  const initialNodes = useMemo(
    () =>
      courses.map((course, index) =>
        createCourseNode({
          course,
          userId: user?.id ?? null,
          progress:
            progress.find((el) => el.course_id === course.id && el.user_id === user?.id) ?? null,
          index,
          onCourseRemove,
          onCourseUpdate,
          onProgressChange,
          canEditFlow: canEditFlow,
          canEditCourse: canEditCourse(user, course),
        }),
      ),
    [courses, onCourseRemove, canEditFlow, onCourseUpdate, user, onProgressChange, progress],
  )

  const initialEdges = useMemo(() => mapPrerequisitesToEdges(prerequisites), [prerequisites])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ICourseFlowNodeData>>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges)

  useEffect(() => {
    setNodes((currentNodes) => {
      const currentNodeById = new Map(currentNodes.map((node) => [node.id, node]))

      return courses.map((course, index) => {
        const nextNode = createCourseNode({
          course,
          userId: user?.id ?? null,
          progress:
            progress.find((el) => el.course_id === course.id && el.user_id === user?.id) ?? null,
          index,
          onCourseRemove,
          onCourseUpdate,
          onProgressChange,
          canEditFlow: canEditFlow,
          canEditCourse: canEditCourse(user, course),
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
    onCourseRemove,
    setNodes,
    canEditFlow,
    onCourseUpdate,
    onProgressChange,
    progress,
    user,
  ])

  useEffect(() => {
    setEdges(mapPrerequisitesToEdges(prerequisites))
  }, [prerequisites, setEdges])

  const handleEdgesDelete = (deletedEdges: Edge[]) => {
    const deletedPrerequisites = mapDeletedEdgesToPrerequisites(deletedEdges, prerequisites)

    deletedPrerequisites.forEach((el) => onEdgeDelete(el))
  }

  const handleEdgeConnect = (connection: Connection) => {
    const prerequisiteCreateResult = mapConnectionToPrerequisiteCreate(connection)

    if (!prerequisiteCreateResult) {
      console.log('no prerequisiteCreateResult')
      return
    }

    onEdgeConnect(prerequisiteCreateResult.courseId, prerequisiteCreateResult.payload)
  }

  return (
    <section className={styles.root} aria-label="Холст программы">
      <ReactFlowProvider>
        <ReactFlow
          fitView
          className={styles.flow}
          defaultEdgeOptions={defaultEdgeOptions}
          edges={edges}
          nodes={nodes}
          nodeTypes={nodeTypes}
          nodesConnectable={canEditFlow}
          onConnect={canEditFlow ? handleEdgeConnect : undefined}
          onEdgesDelete={canEditFlow ? handleEdgesDelete : undefined}
          onEdgesChange={canEditFlow ? onEdgesChange : undefined}
          onNodesChange={onNodesChange}
          proOptions={{ hideAttribution: true }}
          fitViewOptions={{
            minZoom: 0.8,
            maxZoom: 0.8,
          }}
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

      {!courses.length ? (
        <div className={styles.empty}>
          <strong>Холст пуст</strong>
          <span>Добавь курс, чтобы создать первый перетаскиваемый элемент.</span>
        </div>
      ) : null}
    </section>
  )
}
