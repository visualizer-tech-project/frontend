import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

type DragState = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

export const useDrag = () => {
  const ref = useRef<HTMLElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest('button, input')) {
        return
      }

      event.preventDefault()
      ref.current?.setPointerCapture(event.pointerId)
      const rect = ref.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const navHeight = document.querySelector('.main-nav')?.getBoundingClientRect().height ?? 0

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
        minX: -rect.left,
        maxX: window.innerWidth - rect.right,
        minY: position.y - rect.top + navHeight,
        maxY: position.y + (window.innerHeight - rect.bottom),
        width: rect.width,
        height: rect.height,
      }
      setIsDragging(true)
    },
    [position.x, position.y],
  )

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    const nextX = dragStateRef.current.originX + event.clientX - dragStateRef.current.startX
    const nextY = dragStateRef.current.originY + event.clientY - dragStateRef.current.startY

    const clampedY = Math.min(dragStateRef.current.maxY, Math.max(dragStateRef.current.minY, nextY))

    setPosition({ x: nextX, y: clampedY })
  }, [])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    if (ref.current?.hasPointerCapture(event.pointerId)) {
      ref.current.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
    setIsDragging(false)
  }, [])

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
