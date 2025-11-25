import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour la gestion des modales
 * Simplifie l'état et les actions des modales
 */
export function useModal(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

/**
 * Hook pour gérer plusieurs modales
 */
export function useModals<T extends string>(modalNames: T[]) {
  const [openModals, setOpenModals] = useState<Record<T, boolean>>(
    modalNames.reduce((acc, name) => ({ ...acc, [name]: false }), {} as Record<T, boolean>)
  )

  const open = useCallback((name: T) => {
    setOpenModals(prev => ({ ...prev, [name]: true }))
  }, [])

  const close = useCallback((name: T) => {
    setOpenModals(prev => ({ ...prev, [name]: false }))
  }, [])

  const toggle = useCallback((name: T) => {
    setOpenModals(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  const isOpen = useCallback((name: T) => openModals[name], [openModals])

  return {
    openModals,
    open,
    close,
    toggle,
    isOpen,
  }
}
