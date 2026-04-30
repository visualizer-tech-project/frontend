import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import styles from './ProgramGraph.module.css'

const NODE_WIDTH = 220
const NODE_HEIGHT = 126
const NODE_PADDING = 24

type PortSide = 'left' | 'right'

type GraphNode = {
  color: string
  id: 'course' | 'lesson'
  items: [string, string]
  label: string
  x: number
  y: number
}

type DragState = {
  id: GraphNode['id']
  offsetX: number
  offsetY: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const getPortPosition = (node: GraphNode, side: PortSide) => {
  if (side === 'right') {
    return {
      x: node.x + NODE_WIDTH,
      y: node.y + NODE_HEIGHT / 2,
    }
  }

  return {
    x: node.x,
    y: node.y + NODE_HEIGHT / 2,
  }
}

const createInitialNodes = (): GraphNode[] => [
  {
    id: 'course',
    label: 'Курс',
    color: '#7f8cff',
    x: 220,
    y: 150,
    items: ['Название курса', 'Описание'],
  },
  {
    id: 'lesson',
    label: 'Урок',
    color: '#53d6a7',
    x: 620,
    y: 240,
    items: ['Тема занятия', 'Практика'],
  },
]

export const ProgramGraph = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const hasDraggedRef = useRef(false)
  const [activeNodeId, setActiveNodeId] = useState<GraphNode['id'] | null>(null)
  const [nodes, setNodes] = useState<GraphNode[]>(createInitialNodes)

  useEffect(() => {
    const syncNodesToViewport = () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const rect = container.getBoundingClientRect()
      const maxX = Math.max(NODE_PADDING, rect.width - NODE_WIDTH - NODE_PADDING)
      const maxY = Math.max(NODE_PADDING, rect.height - NODE_HEIGHT - NODE_PADDING)

      setNodes((currentNodes) => {
        if (hasDraggedRef.current) {
          return currentNodes.map((node) => ({
            ...node,
            x: clamp(node.x, NODE_PADDING, maxX),
            y: clamp(node.y, NODE_PADDING, maxY),
          }))
        }

        const centeredX = clamp((rect.width - NODE_WIDTH) / 2, NODE_PADDING, maxX)

        if (rect.width < 760) {
          return [
            {
              ...currentNodes[0],
              x: centeredX,
              y: clamp(110, NODE_PADDING, maxY),
            },
            {
              ...currentNodes[1],
              x: centeredX,
              y: clamp(300, NODE_PADDING, maxY),
            },
          ]
        }

        return [
          {
            ...currentNodes[0],
            x: clamp(220, NODE_PADDING, maxX),
            y: clamp(150, NODE_PADDING, maxY),
          },
          {
            ...currentNodes[1],
            x: clamp(rect.width - NODE_WIDTH - 140, NODE_PADDING, maxX),
            y: clamp(250, NODE_PADDING, maxY),
          },
        ]
      })
    }

    const stopDragging = () => {
      dragStateRef.current = null
      setActiveNodeId(null)
      document.body.style.userSelect = ''
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      const container = containerRef.current

      if (!dragState || !container) {
        return
      }

      const rect = container.getBoundingClientRect()
      const maxX = Math.max(NODE_PADDING, rect.width - NODE_WIDTH - NODE_PADDING)
      const maxY = Math.max(NODE_PADDING, rect.height - NODE_HEIGHT - NODE_PADDING)
      const nextX = clamp(event.clientX - rect.left - dragState.offsetX, NODE_PADDING, maxX)
      const nextY = clamp(event.clientY - rect.top - dragState.offsetY, NODE_PADDING, maxY)

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === dragState.id
            ? {
                ...node,
                x: nextX,
                y: nextY,
              }
            : node,
        ),
      )
    }

    syncNodesToViewport()
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    window.addEventListener('resize', syncNodesToViewport)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
      window.removeEventListener('resize', syncNodesToViewport)
      document.body.style.userSelect = ''
    }
  }, [])

  const handleNodePointerDown = (nodeId: GraphNode['id']) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    dragStateRef.current = {
      id: nodeId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    }

    hasDraggedRef.current = true
    setActiveNodeId(nodeId)
    document.body.style.userSelect = 'none'
  }

  const [courseNode, lessonNode] = nodes
  const isCourseOnLeft = courseNode.x <= lessonNode.x
  const source = getPortPosition(courseNode, isCourseOnLeft ? 'right' : 'left')
  const target = getPortPosition(lessonNode, isCourseOnLeft ? 'left' : 'right')
  const controlOffset = Math.max(120, Math.abs(target.x - source.x) / 2)
  const direction = isCourseOnLeft ? 1 : -1
  const linkPath = `M ${source.x} ${source.y} C ${source.x + controlOffset * direction} ${source.y}, ${target.x - controlOffset * direction} ${target.y}, ${target.x} ${target.y}`

  return (
    <div ref={containerRef} className={styles.shell}>
      <div className={styles.canvas}>
        <svg className={styles.edgeLayer}>
          <path className={styles.edgeGlow} d={linkPath} pathLength={1} vectorEffect='non-scaling-stroke' />
          <path className={styles.edge} d={linkPath} pathLength={1} vectorEffect='non-scaling-stroke' />
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={clsx(styles.node, activeNodeId === node.id && styles.nodeDragging)}
            role='presentation'
            style={{
              transform: `translate(${node.x}px, ${node.y}px)`,
              borderColor: node.color,
            }}
            onPointerDown={handleNodePointerDown(node.id)}
          >
            <span className={clsx(styles.port, styles.portLeft)} />
            <span className={clsx(styles.port, styles.portRight)} />
            <span className={clsx(styles.port, styles.portTop)} />
            <span className={clsx(styles.port, styles.portBottom)} />

            <div className={styles.nodeHeader}>{node.label}</div>

            <div className={styles.nodeBody}>
              <div className={styles.nodeItem}>{node.items[0]}</div>
              <div className={styles.nodeItem}>{node.items[1]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
