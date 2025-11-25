import { useEffect, useRef, useState } from 'react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  clientName?: string
  itemName?: string
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, clientName, itemName }: DeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modalRef.current) return

      const newLeft = e.clientX - dragOffset.x
      const newTop = e.clientY - dragOffset.y

      modalRef.current.style.left = `${newLeft}px`
      modalRef.current.style.top = `${newTop}px`
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-confirm-modal" ref={modalRef}>
        <div className="modal-header" onMouseDown={handleMouseDown}>
          <h2>Confirmer la suppression</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="delete-confirm-content">
          <p className="delete-confirm-message">
            Êtes-vous sûr de vouloir supprimer le client suivant ?
          </p>

          <div className="delete-confirm-client">
            <strong>{itemName || clientName}</strong>
          </div>

          <div className="delete-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Cette action est irréversible. Toutes les données du client seront définitivement supprimées.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button
            className="btn-primary"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            style={{ background: '#f85149' }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
