import { useEffect, useRef, useState } from 'react'

interface ColumnSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  columns: { field: string; headerName: string; visible: boolean }[]
  onApply: (visibleColumns: string[]) => void
}

function ColumnSettingsModal({ isOpen, onClose, columns, onApply }: ColumnSettingsModalProps) {
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen) {
      const initialVisibility: { [key: string]: boolean } = {}
      columns.forEach(col => {
        initialVisibility[col.field] = col.visible
      })
      setColumnVisibility(initialVisibility)
    }
  }, [isOpen, columns])

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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDragging, dragOffset, isOpen, onClose])

  const handleToggle = (field: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleApply = () => {
    const visibleFields = Object.keys(columnVisibility).filter(key => columnVisibility[key])
    onApply(visibleFields)
    onClose()
  }

  const handleSelectAll = () => {
    const allVisible: { [key: string]: boolean } = {}
    columns.forEach(col => {
      allVisible[col.field] = true
    })
    setColumnVisibility(allVisible)
  }

  const handleDeselectAll = () => {
    const allHidden: { [key: string]: boolean } = {}
    columns.forEach(col => {
      allHidden[col.field] = false
    })
    setColumnVisibility(allHidden)
  }

  if (!isOpen) return null

  const visibleCount = Object.values(columnVisibility).filter(Boolean).length
  const totalCount = columns.length

  return (
    <div className="modal-overlay">
      <div className="modal-container column-settings-modal" ref={modalRef}>
        <div className="modal-header" onMouseDown={handleMouseDown}>
          <h2>Paramètres des colonnes</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-form column-settings-content">
          <div className="column-settings-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <div className="column-settings-header-text">
              <h3>Personnaliser l'affichage</h3>
              <p>Sélectionnez les colonnes à afficher dans le tableau</p>
            </div>
          </div>

          <div className="column-settings-actions">
            <button className="btn-secondary small" onClick={handleSelectAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Tout sélectionner
            </button>
            <button className="btn-secondary small" onClick={handleDeselectAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Tout désélectionner
            </button>
          </div>

          <div className="column-list-wrapper">
            <div className="column-list">
              {columns.map(col => (
                <label
                  key={col.field}
                  className={`column-item ${columnVisibility[col.field] ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={columnVisibility[col.field] || false}
                    onChange={() => handleToggle(col.field)}
                  />
                  <div className="column-item-content">
                    <span className="column-item-name">{col.headerName}</span>
                    <span className="column-item-field">{col.field}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="column-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
            <span><strong>{visibleCount}</strong> sur {totalCount} colonnes affichées</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleApply}>Appliquer</button>
        </div>
      </div>
    </div>
  )
}

export default ColumnSettingsModal
