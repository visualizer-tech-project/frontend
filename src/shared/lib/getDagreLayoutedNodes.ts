import type { Edge, Node } from '@xyflow/react'
import { Position } from '@xyflow/react'
import dagre from 'dagre'

const DEFAULT_NODE_WIDTH = 220
const DEFAULT_NODE_HEIGHT = 340

export function getDagreLayoutedNodes<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  direction: 'LR' | 'RL' | 'TB' | 'BT' = 'LR',
): Node<T>[] {
  const graph = new dagre.graphlib.Graph({
    directed: true,
    multigraph: true,
    compound: false,
  })

  const isHorizontal = direction === 'LR' || direction === 'RL'

  graph.setDefaultEdgeLabel(() => ({}))

  graph.setGraph({
    rankdir: direction,

    nodesep: 180,
    ranksep: 300,
    edgesep: 80,

    marginx: 80,
    marginy: 80,

    acyclicer: 'greedy',
    ranker: 'network-simplex',
  })

  nodes.forEach((node) => {
    const width = node.measured?.width ?? DEFAULT_NODE_WIDTH
    const height = node.measured?.height ?? DEFAULT_NODE_HEIGHT

    graph.setNode(node.id, {
      width,
      height,
    })
  })

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target, {
      weight: 4,
      minlen: 1,
    })
  })

  dagre.layout(graph)

  return nodes.map((node) => {
    const layoutedNode = graph.node(node.id)

    const width = node.measured?.width ?? DEFAULT_NODE_WIDTH
    const height = node.measured?.height ?? DEFAULT_NODE_HEIGHT

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: layoutedNode.x - width / 2,
        y: layoutedNode.y - height / 2,
      },
    }
  })
}
