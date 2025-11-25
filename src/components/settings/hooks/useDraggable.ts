import { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDraggableReturn {
  position: Position
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  resetPosition: () => void
}

export function useDraggable(headerSelector: string = '.modal-header'): UseDraggableReturn {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(headerSelector)) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }, [position, headerSelector])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    position,
    isDragging,
    handleMouseDown,
    resetPosition
  }
}
