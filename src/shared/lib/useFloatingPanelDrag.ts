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

type HiddenSide = 'left' | 'right' | null

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const useFloatingPanelDrag = (
  initialPosition = { x: 32, y: 108 },
  edgePadding = 0,
  hideOffset = 0,
) => {
  const ref = useRef<HTMLElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)

  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [hiddenSide, setHiddenSide] = useState<HiddenSide>(null)
  const [hiddenCenterY, setHiddenCenterY] = useState(initialPosition.y + 120)

  const restoreAtPosition = (x: number, y: number) => {
    setPosition({ x, y })
    setIsHidden(false)
    setHiddenSide(null)
  }

  const stopDragging = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
    setIsDragging(false)
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

    const deltaX = event.clientX - dragState.startClientX
    const deltaY = event.clientY - dragState.startClientY

    const rawX = dragState.startX + deltaX
    const rawY = dragState.startY + deltaY

    const minY = edgePadding
    const maxY = Math.max(minY, window.innerHeight - dragState.height - edgePadding)
    const maxX = Math.max(edgePadding, window.innerWidth - dragState.width - edgePadding)

    const nextY = clamp(rawY, minY, maxY)

    if (rawX < -(dragState.width * 0.55)) {
      setIsHidden(true)
      setHiddenSide('left')
      setHiddenCenterY(nextY + dragState.height / 2)
      setPosition({ x: -dragState.width - hideOffset, y: nextY })
      stopDragging(event)
      return
    }

    if (rawX > window.innerWidth - dragState.width * 0.45) {
      setIsHidden(true)
      setHiddenSide('right')
      setHiddenCenterY(nextY + dragState.height / 2)
      setPosition({ x: window.innerWidth + hideOffset, y: nextY })
      stopDragging(event)
      return
    }

    setPosition({
      x: clamp(rawX, edgePadding, maxX),
      y: nextY,
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
    isHidden,
    hiddenSide,
    hiddenCenterY,
    restoreAtPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp,
  }
}
