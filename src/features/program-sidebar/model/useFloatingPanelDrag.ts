import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

const EDGE_PADDING = 16
const HIDE_OFFSET = 24

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const getNavigationHeight = () => {
  const navigation = document.querySelector('[data-program-nav="true"]')

  if (!(navigation instanceof HTMLElement)) {
    return 0
  }

  return navigation.getBoundingClientRect().height
}

type DragState = {
  height: number
  offsetX: number
  offsetY: number
  pointerId: number
  width: number
}

export const useFloatingPanelDrag = (initialPosition = { x: 32, y: 108 }) => {
  const ref = useRef<HTMLElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [hiddenSide, setHiddenSide] = useState<'left' | 'right' | null>(null)
  const [hiddenCenterY, setHiddenCenterY] = useState(initialPosition.y + 120)

  const restoreAtPosition = (x: number, y: number) => {
    setPosition({ x, y })
    setIsHidden(false)
    setHiddenSide(null)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, input, a')) {
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
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
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

    const minY = getNavigationHeight() + EDGE_PADDING
    const maxY = Math.max(minY, window.innerHeight - dragState.height - EDGE_PADDING)
    const nextY = clamp(event.clientY - dragState.offsetY, minY, maxY)
    const nextX = event.clientX - dragState.offsetX

    if (nextX < -(dragState.width * 0.55)) {
      setIsHidden(true)
      setHiddenSide('left')
      setHiddenCenterY(nextY + dragState.height / 2)
      setPosition({ x: -dragState.width - HIDE_OFFSET, y: nextY })
      dragStateRef.current = null
      setIsDragging(false)

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      return
    }

    if (nextX > window.innerWidth - dragState.width * 0.45) {
      setIsHidden(true)
      setHiddenSide('right')
      setHiddenCenterY(nextY + dragState.height / 2)
      setPosition({ x: window.innerWidth + HIDE_OFFSET, y: nextY })
      dragStateRef.current = null
      setIsDragging(false)

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      return
    }

    const maxX = Math.max(EDGE_PADDING, window.innerWidth - dragState.width - EDGE_PADDING)

    setPosition({
      x: clamp(nextX, EDGE_PADDING, maxX),
      y: nextY,
    })
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) {
      return
    }

    if (ref.current?.hasPointerCapture(event.pointerId)) {
      ref.current.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
    setIsDragging(false)
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
