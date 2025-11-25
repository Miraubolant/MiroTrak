import { useState, FormEvent, useRef, useEffect } from 'react'
import { AiPhoto } from '../types'
import '../styles/modal.css'

interface AiImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (photoData: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>) => void
  editData?: AiPhoto
  viewOnly?: boolean
}

function AiImageModal({ isOpen, onClose, onSubmit, editData, viewOnly = false }: AiImageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    imagePrompt: '',
    videoPrompt: '',
    imageUrl: '',
  })

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        imagePrompt: editData.imagePrompt || '',
        videoPrompt: editData.videoPrompt || '',
        imageUrl: editData.imageUrl || '',
      })
    } else {
      setFormData({
        name: '',
        imagePrompt: '',
        videoPrompt: '',
        imageUrl: '',
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

  const handleCopy = async (field: 'image' | 'video') => {
    try {
      const text = field === 'image' ? formData.imagePrompt : formData.videoPrompt
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
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
          maxWidth: '800px',
          width: '90%',
        }}
      >
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e6edf3' }}>
            {viewOnly ? 'Aperçu de l\'Image IA' : editData ? 'Modifier l\'Image IA' : 'Nouvelle Image IA'}
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
          <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Image Preview */}
              {formData.imageUrl && (
                <div style={{
                  width: '100%',
                  maxWidth: '350px',
                  margin: '0 auto 8px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #30363d'
                }}>
                  <img
                    src={formData.imageUrl}
                    alt={formData.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* Nom */}
              <div className="form-group">
                <label style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#8b949e',
                  marginBottom: '6px'
                }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              {/* URL de l'image */}
              {!viewOnly && (
                <div className="form-group">
                  <label style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#8b949e',
                    marginBottom: '6px'
                  }}>
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                    placeholder="https://..."
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
              )}

              {/* Prompt Image */}
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
                  <span>Prompt Image</span>
                  {formData.imagePrompt && (
                    <button
                      type="button"
                      onClick={() => handleCopy('image')}
                      style={{
                        background: copiedField === 'image' ? '#58a6ff' : '#21262d',
                        border: `1px solid ${copiedField === 'image' ? '#58a6ff' : '#30363d'}`,
                        borderRadius: '4px',
                        padding: '6px 12px',
                        color: copiedField === 'image' ? '#ffffff' : '#8b949e',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedField === 'image' ? 'Copié !' : 'Copier'}
                    </button>
                  )}
                </label>
                <textarea
                  value={formData.imagePrompt}
                  onChange={(e) => setFormData({ ...formData, imagePrompt: e.target.value })}
                  disabled={viewOnly}
                  rows={6}
                  placeholder="Prompt pour générer l'image..."
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

              {/* Prompt Vidéo */}
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
                  <span>Prompt Vidéo</span>
                  {formData.videoPrompt && (
                    <button
                      type="button"
                      onClick={() => handleCopy('video')}
                      style={{
                        background: copiedField === 'video' ? '#58a6ff' : '#21262d',
                        border: `1px solid ${copiedField === 'video' ? '#58a6ff' : '#30363d'}`,
                        borderRadius: '4px',
                        padding: '6px 12px',
                        color: copiedField === 'video' ? '#ffffff' : '#8b949e',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedField === 'video' ? 'Copié !' : 'Copier'}
                    </button>
                  )}
                </label>
                <textarea
                  value={formData.videoPrompt}
                  onChange={(e) => setFormData({ ...formData, videoPrompt: e.target.value })}
                  disabled={viewOnly}
                  rows={6}
                  placeholder="Prompt pour générer la vidéo..."
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

export default AiImageModal
