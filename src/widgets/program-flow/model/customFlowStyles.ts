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

export const dimmedEdgeOptions = {
  style: {
    stroke: 'rgb(140 195 255 / 32%)',
    strokeWidth: 1.5,
  },
  animated: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'rgb(140 195 255 / 32%)',
  },
}
