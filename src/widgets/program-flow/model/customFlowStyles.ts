import { MarkerType } from '@xyflow/react'

export const defaultEdgeOptions = {
  type: 'smoothstep',
  pathOptions: {
    borderRadius: 4,
    offset: 16,
  },
  style: {
    stroke: '#8cc3ff',
    strokeWidth: 2,
  },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#8cc3ff',
  },
}
