import { useState, FormEvent, useRef, useEffect } from 'react'
import { Prompt } from '../types'
import '../styles/modal.css'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void
  editData?: Prompt
  viewOnly?: boolean
}

function PromptModal({ isOpen, onClose, onSubmit, editData, viewOnly = false }: PromptModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  })

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        category: editData.category || '',
        content: editData.content || '',
      })
    } else {
      setFormData({
        title: '',
        category: '',
        content: '',
      })
    }
  }, [editData, isOpen])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  // Fermer avec Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit && !viewOnly) {
      onSubmit(formData)
      onClose()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formData.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          maxWidth: '700px',
          width: '90%',
        }}
      >
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e6edf3' }}>
            {viewOnly ? 'Aperçu du Prompt' : editData ? 'Modifier le Prompt' : 'Nouveau Prompt'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8b949e',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '0',
              lineHeight: '1',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e6edf3'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8b949e'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Titre */}
              <div className="form-group">
                <label style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#8b949e',
                  marginBottom: '6px'
                }}>
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={viewOnly}
                  required
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Catégorie */}
              <div className="form-group">
                <label style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#8b949e',
                  marginBottom: '6px'
                }}>
                  Catégorie
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={viewOnly}
                  required
                  placeholder="Ex: Marketing, Développement, Design..."
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Contenu */}
              <div className="form-group">
                <label style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#8b949e',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>Contenu</span>
                  {viewOnly && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      style={{
                        background: copied ? '#58a6ff' : '#21262d',
                        border: `1px solid ${copied ? '#58a6ff' : '#30363d'}`,
                        borderRadius: '4px',
                        padding: '6px 12px',
                        color: copied ? '#ffffff' : '#8b949e',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                  )}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  disabled={viewOnly}
                  required
                  rows={12}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            </div>
          </div>

          {!viewOnly && (
            <div className="modal-footer" style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              padding: '16px 24px',
              borderTop: '1px solid #21262d'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#30363d'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={{
                  background: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#30363d'
                  e.currentTarget.style.borderColor = '#58a6ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#21262d'
                  e.currentTarget.style.borderColor = '#30363d'
                }}
              >
                {editData ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default PromptModal
