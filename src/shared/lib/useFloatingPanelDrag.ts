import type { PointerEvent as ReactPointerEvent } from 'react'
import { useRef, useState } from 'react'

type DragState = {
  pointerId: number
  startClientX: number
  startClientY: number
  startX: number
  startY: number
  width: number
  height: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const useFloatingPanelDrag = (initialPosition = { x: 32, y: 108 }, edgePadding = 0) => {
  const ref = useRef<HTMLElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)

  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  const stopDragging = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
    setIsDragging(false)
  }

  const getBounds = () => {
    const container = ref.current?.parentElement
    const rect = container?.getBoundingClientRect()

    return {
      width: rect?.width ?? window.innerWidth,
      height: rect?.height ?? window.innerHeight,
    }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, input, textarea, select, a')) {
      return
    }

    const panel = ref.current

    if (!panel) {
      return
    }

    event.preventDefault()
    panel.setPointerCapture(event.pointerId)

    const rect = panel.getBoundingClientRect()

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      width: rect.width,
      height: rect.height,
    }

    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const { width: containerWidth, height: containerHeight } = getBounds()

    const rawX = dragState.startX + event.clientX - dragState.startClientX
    const rawY = dragState.startY + event.clientY - dragState.startClientY

    const minX = edgePadding
    const minY = edgePadding
    const maxX = Math.max(minX, containerWidth - dragState.width - edgePadding)
    const maxY = Math.max(minY, containerHeight - dragState.height - edgePadding)

    setPosition({
      x: clamp(rawX, minX, maxX),
      y: clamp(rawY, minY, maxY),
    })
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) {
      return
    }

    stopDragging(event)
  }

  return {
    ref,
    position,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp,
  }
}
