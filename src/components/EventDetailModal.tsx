import { useEffect } from 'react'
import '../styles/modal.css'

interface EventDetailModalProps {
  event: {
    title: string
    start: Date
    end?: Date
    extendedProps?: {
      client?: string
      type?: string
      description?: string
    }
    backgroundColor?: string
  }
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function EventDetailModal({ event, onClose, onEdit, onDelete }: EventDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDuration = () => {
    if (!event.end) return ''
    const duration = event.end.getTime() - event.start.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${minutes}min`
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'Réunion':
        return (
          <svg width="20" height="20" fill="currentColor">
            <path d="M10 2C5.03 2 1 6.03 1 11s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H13c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S3.67 8 4.5 8s1.5.67 1.5 1.5S5.33 11 4.5 11zm3-4c-.83 0-1.5-.67-1.5-1.5S6.67 4 7.5 4 9 4.67 9 5.5 8.33 7 7.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S11.67 4 12.5 4s1.5.67 1.5 1.5S13.33 7 12.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        )
      case 'Appel':
        return (
          <svg width="20" height="20" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        )
      case 'Formation':
        return (
          <svg width="20" height="20" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        )
      case 'Livraison':
        return (
          <svg width="20" height="20" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" fill="currentColor">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
        )
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '650px' }}
      >
        {/* En-tête */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: event.backgroundColor || '#58a6ff',
              flexShrink: 0
            }}></div>
            <h2 style={{ margin: 0 }}>{event.title}</h2>
            {event.extendedProps?.type && (
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: '#21262d',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#8b949e',
                marginLeft: 'auto'
              }}>
                {getTypeIcon(event.extendedProps.type)}
                <span style={{ fontSize: '11px' }}>{event.extendedProps.type}</span>
              </div>
            )}
          </div>
          <button 
            className="modal-close" 
            onClick={onClose}
          >
            <svg width="20" height="20" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 01.708 0L10 9.293l4.646-4.647a.5.5 0 01.708.708L10.707 10l4.647 4.646a.5.5 0 01-.708.708L10 10.707l-4.646 4.647a.5.5 0 01-.708-.708L9.293 10 4.646 5.354a.5.5 0 010-.708z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Date et heure */}
            <div style={{ 
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <svg width="16" height="16" fill="currentColor" style={{ color: '#8b949e', flexShrink: 0 }}>
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"/>
                </svg>
                <div style={{ fontSize: '12px', color: '#8b949e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Date et heure
                </div>
              </div>
              
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#c9d1d9', marginBottom: '8px' }}>
                {formatDate(event.start)}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #21262d'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#6e7681', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Début</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#c9d1d9' }}>
                    {formatTime(event.start)}
                  </div>
                </div>
                {event.end && (
                  <>
                    <div style={{ width: '1px', background: '#21262d' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#6e7681', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Fin</div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#c9d1d9' }}>
                        {formatTime(event.end)}
                      </div>
                    </div>
                    <div style={{ width: '1px', background: '#21262d' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#6e7681', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Durée</div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#58a6ff' }}>
                        {formatDuration()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Client */}
            {event.extendedProps?.client && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '16px',
                background: '#0d1117',
                borderRadius: '8px',
                border: '1px solid #21262d'
              }}>
                <svg width="16" height="16" fill="currentColor" style={{ color: '#8b949e', flexShrink: 0 }}>
                  <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-4 9a4 4 0 00-4 4v1a2 2 0 002 2h12a2 2 0 002-2v-1a4 4 0 00-4-4H6z"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#6e7681', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Client
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#c9d1d9' }}>
                    {event.extendedProps.client}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {event.extendedProps?.description && (
              <div style={{ 
                padding: '16px',
                background: '#0d1117',
                borderRadius: '8px',
                border: '1px solid #21262d'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <svg width="16" height="16" fill="currentColor" style={{ color: '#8b949e', flexShrink: 0 }}>
                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v1H7V5zm0 3h6v1H7V8zm0 3h4v1H7v-1z"/>
                  </svg>
                  <div style={{ fontSize: '11px', color: '#6e7681', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 500 }}>
                    Description
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  whiteSpace: 'pre-wrap',
                  color: '#8b949e'
                }}>
                  {event.extendedProps.description}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ flex: 1 }}></div>
          <div className="modal-footer-right">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#f85149',
                  border: '1px solid rgba(248, 81, 73, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(248, 81, 73, 0.1)'
                  e.currentTarget.style.borderColor = '#f85149'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(248, 81, 73, 0.4)'
                }}
              >
                <svg width="14" height="14" fill="currentColor">
                  <path d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5H3a1 1 0 010-2h3V2zm2 3a1 1 0 00-1 1v7a1 1 0 102 0V6a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v7a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                </svg>
                Supprimer
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  background: '#21262d',
                  color: '#c9d1d9',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#30363d'
                  e.currentTarget.style.borderColor = '#484f58'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#21262d'
                  e.currentTarget.style.borderColor = '#30363d'
                }}
              >
                <svg width="14" height="14" fill="currentColor">
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 111.707 1.708l-.149.148a1.5 1.5 0 01-.059 2.059L4.854 14.854a.5.5 0 01-.233.131l-4 1a.5.5 0 01-.606-.606l1-4a.5.5 0 01.131-.232l9.642-9.642a.5.5 0 00-.642.056L6.854 4.854a.5.5 0 11-.708-.708L9.44.854A1.5 1.5 0 0111.5.796a1.5 1.5 0 011.998-.001z"/>
                </svg>
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
